import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Wrench,
  PlugsConnected,
  BookOpen,
  CircleHalf,
  Timer,
  CloudArrowUp,
  CloudArrowDown,
  ArrowRight,
  ArrowLeft,
  X,
  File as FileIcon,
  Upload,
  Sliders,
  CheckCircle,
  CarProfile,
  HardDrives,
  Crown,
  Link,
  Car,
  Engine,
  GasPump,
  Calendar,
  Tag
} from '@phosphor-icons/react';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const readingDevices = [
  { group: 'Autotuner', logo: '/logos/autotuner.png', options: ['Tool'] },
  { group: 'Alientech', logo: '/logos/alientech.png', options: ['Kess3'] },
  { group: 'Magic Motorsport', logo: '/logos/magicmotorsport.png', options: ['Flex'] },
  { group: null, logo: '/logos/autoflasher.png', options: ['Autoflasher'] },
  { group: null, logo: null, options: ['CMD Flash'] },
  { group: 'Dimsport', logo: '/logos/dimsport.png', options: ['NewGenius'] },
];

const ALLOWED_EXTENSIONS = ['.bin', '.ori', '.mod', '.ecu', '.hex', '.s19', '.bkp', '.slave'];

function ToggleOption({ label, selected, onClick, extra, testId, icon, IconComponent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "flex-1 py-3 px-4 text-sm font-semibold rounded-sm border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
        selected
          ? "bg-primary/10 border-primary text-foreground"
          : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon && <img src={icon} alt="" className="h-5 w-5 object-contain" />}
      {IconComponent && <IconComponent weight="bold" className="w-5 h-5" />}
      <span>{label}</span>
      {extra && (
        <span className="ml-1 text-primary font-bold">{extra}</span>
      )}
    </button>
  );
}

export default function FileWizard() {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    readingDevice: '',
    readingMethod: 'OBD',
    readingType: 'Full Read',
    masterSlave: 'Master',
    priority: 'Normal',
    comment: '',
    // Step 2 - Fahrzeug
    manufacturer: '',
    model: '',
    year: '',
    engine: '',
    ecu: '',
    gearbox: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Parse filename into readable parts
  const parsedFilename = useMemo(() => {
    if (uploadedFiles.length === 0) return null;
    const name = uploadedFiles[0].name;
    const nameWithoutExt = name.replace(/\.[^/.]+$/, '');
    // Try common separators: underscore, dash, space
    const parts = nameWithoutExt.split(/[_\-\s]+/).filter(Boolean);
    
    // Known manufacturer names for matching
    const manufacturers = ['BMW', 'VW', 'Volkswagen', 'Audi', 'Mercedes', 'Benz', 'Porsche', 'Seat', 'Skoda', 'Opel', 'Ford', 'Toyota', 'Honda', 'Renault', 'Peugeot', 'Citroen', 'Fiat', 'Alfa', 'Hyundai', 'Kia', 'Volvo', 'Jaguar', 'Land', 'Range', 'Mini', 'Mazda', 'Nissan', 'Subaru', 'Mitsubishi', 'Suzuki', 'Dacia', 'Chevrolet', 'Dodge', 'Jeep', 'Cupra', 'DS', 'MAN', 'DAF', 'Scania', 'Iveco', 'Mercedes-Benz'];
    
    let parsed = { manufacturer: '', model: '', engine: '', ecu: '', rest: [] };
    let remaining = [...parts];
    
    // Try to find manufacturer
    if (remaining.length > 0) {
      const mfIdx = remaining.findIndex(p => 
        manufacturers.some(m => m.toLowerCase() === p.toLowerCase())
      );
      if (mfIdx !== -1) {
        parsed.manufacturer = remaining[mfIdx];
        remaining.splice(mfIdx, 1);
      }
    }
    
    // Try to find ECU (common patterns: EDC17, MED17, PCR2, Bosch, Siemens, Delphi, Continental)
    const ecuPattern = /^(EDC|MED|PCR|MD1|MG1|SID|DCM|MEDC|Bosch|Siemens|Delphi|Continental|Marelli)/i;
    const ecuIdx = remaining.findIndex(p => ecuPattern.test(p));
    if (ecuIdx !== -1) {
      parsed.ecu = remaining.splice(ecuIdx, remaining.length - ecuIdx).join(' ');
    }
    
    // Try to find engine (patterns with L, TDI, TSI, TFSI, CDI, d, i, etc.)
    const enginePattern = /(\d+\.?\d*\s*(L|l|TDI|TSI|TFSI|CDI|HDI|JTD|CDTI|CRDi|T|d|i|V\d))|^(N\d{2}|M\d{2}|EA\d{3}|OM\d{3}|CUNA|CBBB|CFGB)/i;
    const engIdx = remaining.findIndex(p => enginePattern.test(p));
    if (engIdx !== -1) {
      parsed.engine = remaining.splice(engIdx, 1)[0];
    }
    
    // First remaining = model, rest = extra info
    if (remaining.length > 0) parsed.model = remaining.shift();
    parsed.rest = remaining;
    
    // Build readable name
    const readableParts = [parsed.manufacturer, parsed.model, parsed.engine, parsed.ecu, ...parsed.rest].filter(Boolean);
    
    return {
      original: name,
      readable: readableParts.join(' '),
      parts: parsed,
    };
  }, [uploadedFiles]);

  const t = (key) => {
    const texts = {
      de: {
        pageTitle: 'Neuer Auftrag',
        stepTitle: 'File & Lesegerät',
        step: 'STEP',
        tuningTool: 'TUNING TOOL / LESEGERÄT',
        selectDevice: 'Lesegerät auswählen...',
        readingMethod: 'LESEMETHODE',
        readingType: 'LESEART',
        masterSlave: 'MASTER / SLAVE',
        priority: 'PRIORITÄT',
        comment: 'KOMMENTAR (OPTIONAL)',
        commentPlaceholder: 'Zusätzliche Hinweise, Wünsche oder Informationen...',
        dropFile: 'Datei hierher ziehen',
        orClick: 'oder klicken zum Auswählen',
        addressesMore: 'Adressen und mehr',
        nextStep: 'Weiter zu Schritt 2',
        prevStep: 'Zurück',
        fileAdded: 'Datei hinzugefügt',
        removeFile: 'Entfernen',
        // Step 2
        step2Title: 'Fahrzeugauswahl',
        uploadedFile: 'HOCHGELADENE DATEI',
        parsedAs: 'Erkannt als',
        manufacturer: 'HERSTELLER',
        manufacturerPlaceholder: 'z.B. BMW, VW, Audi...',
        model: 'MODELL',
        modelPlaceholder: 'z.B. 320d, Golf 7, A4...',
        year: 'BAUJAHR',
        yearPlaceholder: 'z.B. 2019',
        engine: 'MOTOR',
        enginePlaceholder: 'z.B. 2.0 TDI, N47, OM654...',
        ecu: 'STEUERGERÄT (ECU)',
        ecuPlaceholder: 'z.B. EDC17C50, MED17.1...',
        gearbox: 'GETRIEBE',
        gearboxPlaceholder: 'z.B. Automatik, Manuell, DSG...',
        nextStep3: 'Weiter zu Schritt 3',
      },
      en: {
        pageTitle: 'New Order',
        stepTitle: 'File & Reading Device',
        step: 'STEP',
        tuningTool: 'TUNING TOOL / READING DEVICE',
        selectDevice: 'Select reading device...',
        readingMethod: 'READING METHOD',
        readingType: 'READING TYPE',
        masterSlave: 'MASTER / SLAVE',
        priority: 'PRIORITY',
        comment: 'COMMENT (OPTIONAL)',
        commentPlaceholder: 'Additional notes, wishes or information...',
        dropFile: 'Drag file here',
        orClick: 'or click to select',
        addressesMore: 'Addresses and more',
        nextStep: 'Continue to Step 2',
        prevStep: 'Back',
        fileAdded: 'File added',
        removeFile: 'Remove',
        // Step 2
        step2Title: 'Vehicle Selection',
        uploadedFile: 'UPLOADED FILE',
        parsedAs: 'Detected as',
        manufacturer: 'MANUFACTURER',
        manufacturerPlaceholder: 'e.g. BMW, VW, Audi...',
        model: 'MODEL',
        modelPlaceholder: 'e.g. 320d, Golf 7, A4...',
        year: 'YEAR',
        yearPlaceholder: 'e.g. 2019',
        engine: 'ENGINE',
        enginePlaceholder: 'e.g. 2.0 TDI, N47, OM654...',
        ecu: 'ECU',
        ecuPlaceholder: 'e.g. EDC17C50, MED17.1...',
        gearbox: 'GEARBOX',
        gearboxPlaceholder: 'e.g. Automatic, Manual, DSG...',
        nextStep3: 'Continue to Step 3',
      },
    };
    return texts[language]?.[key] || texts.de[key] || key;
  };

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter((file) => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });
    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const wizardSteps = [
    { id: 1, icon: Upload, label: language === 'de' ? 'File & Lesegerät' : 'File & Device' },
    { id: 2, icon: CarProfile, label: language === 'de' ? 'Fahrzeug' : 'Vehicle' },
    { id: 3, icon: Sliders, label: language === 'de' ? 'Optionen' : 'Options' },
    { id: 4, icon: CheckCircle, label: language === 'de' ? 'Übersicht' : 'Review' },
  ];
  const progress = (currentStep / wizardSteps.length) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Step Progress Indicator */}
        <Card className="bg-card border-border" data-testid="wizard-progress-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-sm flex items-center justify-center transition-colors duration-200",
                          isActive && "bg-primary text-white",
                          isCompleted && "bg-green-500/20 text-green-400 border border-green-500/30",
                          !isActive && !isCompleted && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle weight="fill" className="w-6 h-6" />
                        ) : (
                          <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs mt-2 font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {index < wizardSteps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-16 md:w-24 mx-2",
                        isCompleted ? "bg-green-500/50" : "bg-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1" />
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
              {currentStep === 1 ? t('stepTitle') : t('step2Title')}
            </h1>
            <div className="w-10 h-1 bg-green-500 rounded-full mt-2" />
          </div>
          <span className="text-primary font-heading font-bold text-sm tracking-widest" data-testid="step-indicator">
            {t('step')} {String(currentStep).padStart(2, '0')}
          </span>
        </div>

        {/* ====== STEP 1: File & Lesegerät ====== */}
        {currentStep === 1 && (<>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <Card className="bg-card border-border" data-testid="wizard-form-card">
            <CardContent className="p-6 space-y-7">
              {/* Tuning Tool / Lesegerät */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <Wrench weight="bold" className="w-3.5 h-3.5" />
                  {t('tuningTool')}
                </label>
                <Select
                  value={formData.readingDevice}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, readingDevice: val }))}
                >
                  <SelectTrigger
                    className="w-full h-12 bg-secondary/50 border-border text-sm"
                    data-testid="reading-device-select"
                  >
                    <SelectValue placeholder={t('selectDevice')}>
                      {formData.readingDevice && (() => {
                        const selected = readingDevices.find((e) =>
                          e.group
                            ? e.options.some((o) => `${e.group} - ${o}` === formData.readingDevice)
                            : e.options.includes(formData.readingDevice)
                        );
                        const logo = selected?.logo;
                        const label = formData.readingDevice.includes(' - ')
                          ? formData.readingDevice.split(' - ')[1]
                          : formData.readingDevice;
                        return (
                          <span className="flex items-center gap-2.5">
                            {logo && <img src={logo} alt="" className="h-4 w-16 object-contain object-left" />}
                            {label}
                          </span>
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {readingDevices.map((entry, idx) =>
                      entry.group ? (
                        <SelectGroup key={idx}>
                          {idx > 0 && <div className="h-px bg-border mx-2 my-1.5" />}
                          <SelectLabel className="flex items-center gap-2.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">
                            {entry.logo ? (
                              <img src={entry.logo} alt={entry.group} className="h-4 w-16 object-contain object-left" />
                            ) : (
                              entry.group
                            )}
                          </SelectLabel>
                          {entry.options.map((opt) => (
                            <SelectItem key={opt} value={`${entry.group} - ${opt}`}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ) : (
                        <div key={idx}>
                          {idx > 0 && <div className="h-px bg-border mx-2 my-1.5" />}
                          {entry.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              <span className="flex items-center gap-2.5">
                                {entry.logo ? (
                                  <img src={entry.logo} alt="" className="h-4 w-16 object-contain object-left" />
                                ) : (
                                  opt
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Lesemethode */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <PlugsConnected weight="bold" className="w-3.5 h-3.5" />
                  {t('readingMethod')}
                </label>
                <div className="flex gap-2" data-testid="reading-method-group">
                  {[
                    { label: 'OBD', icon: '/logos/obd.svg' },
                    { label: 'Bench', icon: '/logos/bench.svg' },
                    { label: 'Boot', icon: '/logos/boot.svg' },
                  ].map((method) => (
                    <ToggleOption
                      key={method.label}
                      label={method.label}
                      icon={method.icon}
                      selected={formData.readingMethod === method.label}
                      onClick={() => setFormData((prev) => ({ ...prev, readingMethod: method.label }))}
                      testId={`method-${method.label.toLowerCase()}`}
                    />
                  ))}
                </div>
              </div>

              {/* Leseart */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <BookOpen weight="bold" className="w-3.5 h-3.5" />
                  {t('readingType')}
                </label>
                <div className="flex gap-2" data-testid="reading-type-group">
                  {[
                    { label: 'Full Read', Icon: HardDrives },
                    { label: 'Virtuell', Icon: CloudArrowDown },
                  ].map((type) => (
                    <ToggleOption
                      key={type.label}
                      label={type.label}
                      IconComponent={type.Icon}
                      selected={formData.readingType === type.label}
                      onClick={() => setFormData((prev) => ({ ...prev, readingType: type.label }))}
                      testId={`type-${type.label.toLowerCase().replace(' ', '-')}`}
                    />
                  ))}
                </div>
              </div>

              {/* Master / Slave */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <CircleHalf weight="bold" className="w-3.5 h-3.5" />
                  {t('masterSlave')}
                </label>
                <div className="flex gap-2" data-testid="master-slave-group">
                  {[
                    { label: 'Master', Icon: Crown },
                    { label: 'Slave', Icon: Link },
                  ].map((ms) => (
                    <ToggleOption
                      key={ms.label}
                      label={ms.label}
                      IconComponent={ms.Icon}
                      selected={formData.masterSlave === ms.label}
                      onClick={() => setFormData((prev) => ({ ...prev, masterSlave: ms.label }))}
                      testId={`ms-${ms.label.toLowerCase()}`}
                    />
                  ))}
                </div>
              </div>

              {/* Priorität */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <Timer weight="bold" className="w-3.5 h-3.5" />
                  {t('priority')}
                </label>
                <div className="flex gap-2" data-testid="priority-group">
                  <ToggleOption
                    label="Normal"
                    selected={formData.priority === 'Normal'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Normal' }))}
                    testId="priority-normal"
                  />
                  <ToggleOption
                    label="Express"
                    extra="+49€"
                    selected={formData.priority === 'Express'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Express' }))}
                    testId="priority-express"
                  />
                  <ToggleOption
                    label="Sofort"
                    extra="+99€"
                    selected={formData.priority === 'Sofort'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Sofort' }))}
                    testId="priority-sofort"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - File Upload */}
          <Card className="bg-card border-border" data-testid="wizard-upload-card">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-secondary/50 border border-border rounded-sm"
                      data-testid={`uploaded-file-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon weight="fill" className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`remove-file-${index}`}
                      >
                        <X weight="bold" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                className={cn(
                  "flex-1 min-h-[280px] border-2 border-dashed rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                data-testid="file-drop-zone"
              >
                <CloudArrowUp
                  weight="thin"
                  className={cn(
                    "w-14 h-14 transition-colors",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="text-center">
                  <p className="font-heading font-semibold text-foreground">
                    {t('dropFile')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('orClick')}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground tracking-wide">
                  {ALLOWED_EXTENSIONS.join(' ')}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  multiple
                  onChange={(e) => {
                    handleFileSelect(e.target.files);
                    e.target.value = '';
                  }}
                  data-testid="file-input"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comment Section (Full Width) */}
        <Card className="bg-card border-border" data-testid="wizard-comment-card">
          <CardContent className="p-6">
            <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
              {t('comment')}
            </label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder={t('commentPlaceholder')}
              className="min-h-[120px] bg-secondary/30 border-border resize-y"
              data-testid="comment-textarea"
            />
          </CardContent>
        </Card>

        {/* Step 1 Navigation */}
        <div className="flex justify-end">
          <Button
            className="btn-gradient text-white font-semibold px-8 py-3 h-auto"
            data-testid="wizard-next-btn"
            onClick={() => setCurrentStep(2)}
          >
            {t('nextStep')}
            <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
          </Button>
        </div>
        </>)}

        {/* ====== STEP 2: Fahrzeugauswahl ====== */}
        {currentStep === 2 && (<>
          {/* Filename Display */}
          {parsedFilename && (
            <Card className="bg-card border-border" data-testid="filename-display-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                  <FileIcon weight="bold" className="w-3.5 h-3.5" />
                  {t('uploadedFile')}
                </label>
                <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-sm px-4 py-3 mb-4">
                  <FileIcon weight="fill" className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-foreground truncate">{parsedFilename.original}</p>
                    {parsedFilename.readable && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('parsedAs')}: <span className="text-foreground font-medium">{parsedFilename.readable}</span>
                      </p>
                    )}
                  </div>
                </div>
                {/* Parsed details badges */}
                <div className="flex flex-wrap gap-3">
                  {parsedFilename.parts.manufacturer && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-sm px-4 py-2">
                      <Car weight="bold" className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('manufacturer')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.manufacturer}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.model && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <Tag weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('model')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.model}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.engine && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <Engine weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('engine')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.engine}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.ecu && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-sm px-4 py-2">
                      <GasPump weight="bold" className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('ecu')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.ecu}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border" data-testid="vehicle-form-left">
              <CardContent className="p-6 space-y-6">
                {/* Hersteller */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Car weight="bold" className="w-3.5 h-3.5" />
                    {t('manufacturer')}
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder={t('manufacturerPlaceholder')}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-sm px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="input-manufacturer"
                  />
                </div>

                {/* Modell */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Tag weight="bold" className="w-3.5 h-3.5" />
                    {t('model')}
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    placeholder={t('modelPlaceholder')}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-sm px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="input-model"
                  />
                </div>

                {/* Baujahr */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Calendar weight="bold" className="w-3.5 h-3.5" />
                    {t('year')}
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder={t('yearPlaceholder')}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-sm px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="input-year"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border" data-testid="vehicle-form-right">
              <CardContent className="p-6 space-y-6">
                {/* Motor */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Engine weight="bold" className="w-3.5 h-3.5" />
                    {t('engine')}
                  </label>
                  <input
                    type="text"
                    value={formData.engine}
                    onChange={(e) => setFormData(prev => ({ ...prev, engine: e.target.value }))}
                    placeholder={t('enginePlaceholder')}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-sm px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="input-engine"
                  />
                </div>

                {/* ECU / Steuergerät */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <GasPump weight="bold" className="w-3.5 h-3.5" />
                    {t('ecu')}
                  </label>
                  <input
                    type="text"
                    value={formData.ecu}
                    onChange={(e) => setFormData(prev => ({ ...prev, ecu: e.target.value }))}
                    placeholder={t('ecuPlaceholder')}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-sm px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="input-ecu"
                  />
                </div>

                {/* Getriebe */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Sliders weight="bold" className="w-3.5 h-3.5" />
                    {t('gearbox')}
                  </label>
                  <Select
                    value={formData.gearbox}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, gearbox: val }))}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/50 border-border text-sm" data-testid="select-gearbox">
                      <SelectValue placeholder={t('gearboxPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Manuell">Manuell</SelectItem>
                      <SelectItem value="Automatik">Automatik</SelectItem>
                      <SelectItem value="DSG">DSG</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="PDK">PDK</SelectItem>
                      <SelectItem value="SMG">SMG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 2 Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="border-border hover:bg-secondary font-semibold px-6 py-3 h-auto"
              onClick={() => setCurrentStep(1)}
              data-testid="wizard-prev-btn"
            >
              <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
              {t('prevStep')}
            </Button>
            <Button
              className="btn-gradient text-white font-semibold px-8 py-3 h-auto"
              data-testid="wizard-next-btn-step2"
            >
              {t('nextStep3')}
              <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>)}

      </div>
    </DashboardLayout>
  );
}

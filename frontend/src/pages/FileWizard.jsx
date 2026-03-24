import { useState, useCallback, useRef } from 'react';
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
  ArrowRight,
  X,
  File as FileIcon,
  Upload,
  Sliders,
  CheckCircle,
  CarProfile
} from '@phosphor-icons/react';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const readingDevices = [
  { group: 'Autotuner', logo: '/logos/autotuner.png', options: ['Tool'] },
  { group: 'Alientech', logo: '/logos/alientech.png', options: ['Kess3'] },
  { group: 'Magic Motorsport', logo: null, options: ['Flex'] },
  { group: null, logo: '/logos/autoflasher.png', options: ['Autoflasher'] },
  { group: null, logo: null, options: ['CMD Flash'] },
  { group: 'Dimsport', logo: '/logos/dimsport.png', options: ['NewGenius'] },
];

const ALLOWED_EXTENSIONS = ['.bin', '.ori', '.mod', '.ecu', '.hex', '.s19', '.bkp'];

function ToggleOption({ label, selected, onClick, extra, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "flex-1 py-3 px-4 text-sm font-semibold rounded-sm border transition-all duration-200 cursor-pointer text-center",
        selected
          ? "bg-primary/10 border-primary text-foreground"
          : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <span>{label}</span>
      {extra && (
        <span className="ml-1.5 text-primary font-bold">{extra}</span>
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
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

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
        fileAdded: 'Datei hinzugefügt',
        removeFile: 'Entfernen',
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
        fileAdded: 'File added',
        removeFile: 'Remove',
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

  const currentStep = 1;
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
              {t('stepTitle')}
            </h1>
            <div className="w-10 h-1 bg-green-500 rounded-full mt-2" />
          </div>
          <span className="text-primary font-heading font-bold text-sm tracking-widest" data-testid="step-indicator">
            {t('step')} 01
          </span>
        </div>

        {/* Main Content: 2 Columns */}
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
                    <SelectValue placeholder={t('selectDevice')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {readingDevices.map((entry, idx) =>
                      entry.group ? (
                        <SelectGroup key={idx}>
                          <SelectLabel className="flex items-center gap-2 text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">
                            {entry.logo && (
                              <img src={entry.logo} alt={entry.group} className="h-4 w-auto object-contain" />
                            )}
                            {entry.group}
                          </SelectLabel>
                          {entry.options.map((opt) => (
                            <SelectItem key={opt} value={`${entry.group} - ${opt}`}>
                              <span className="flex items-center gap-2">
                                {entry.logo && (
                                  <img src={entry.logo} alt="" className="h-3.5 w-auto object-contain" />
                                )}
                                {opt}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ) : (
                        entry.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            <span className="flex items-center gap-2">
                              {entry.logo && (
                                <img src={entry.logo} alt="" className="h-3.5 w-auto object-contain" />
                              )}
                              {opt}
                            </span>
                          </SelectItem>
                        ))
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
                  {['OBD', 'Bench', 'Boot'].map((method) => (
                    <ToggleOption
                      key={method}
                      label={method}
                      selected={formData.readingMethod === method}
                      onClick={() => setFormData((prev) => ({ ...prev, readingMethod: method }))}
                      testId={`method-${method.toLowerCase()}`}
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
                  {['Full Read', 'Virtuell'].map((type) => (
                    <ToggleOption
                      key={type}
                      label={type}
                      selected={formData.readingType === type}
                      onClick={() => setFormData((prev) => ({ ...prev, readingType: type }))}
                      testId={`type-${type.toLowerCase().replace(' ', '-')}`}
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
                  {['Master', 'Slave'].map((ms) => (
                    <ToggleOption
                      key={ms}
                      label={ms}
                      selected={formData.masterSlave === ms}
                      onClick={() => setFormData((prev) => ({ ...prev, masterSlave: ms }))}
                      testId={`ms-${ms.toLowerCase()}`}
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

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            className="btn-gradient text-white font-semibold px-8 py-3 h-auto"
            data-testid="wizard-next-btn"
          >
            {t('nextStep')}
            <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

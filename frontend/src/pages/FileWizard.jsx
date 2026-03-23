import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  CarProfile, 
  Upload, 
  Sliders, 
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';

const steps = [
  { id: 1, icon: CarProfile, labelKey: 'selectVehicle' },
  { id: 2, icon: Upload, labelKey: 'uploadFile' },
  { id: 3, icon: Sliders, labelKey: 'selectOptions' },
  { id: 4, icon: CheckCircle, labelKey: 'review' },
];

export default function FileWizard() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  const progress = (currentStep / steps.length) * 100;

  return (
    <DashboardLayout title={t('fileWizardTitle')}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Indicator */}
        <Card className="bg-card border-border" data-testid="wizard-progress-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-sm flex items-center justify-center transition-colors duration-200",
                          isActive && "bg-primary text-foreground",
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
                        {t(step.labelKey)}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-16 md:w-24 mx-2",
                        isCompleted ? "bg-green-500/50" : "bg-white/10"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="bg-card border-border min-h-[400px]" data-testid="wizard-content-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-heading font-semibold text-lg">
              Step {currentStep}: {t(steps[currentStep - 1].labelKey)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-sm bg-secondary flex items-center justify-center mb-6">
                {(() => {
                  const Icon = steps[currentStep - 1].icon;
                  return <Icon weight="thin" className="w-10 h-10 text-muted-foreground" />;
                })()}
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                {t(steps[currentStep - 1].labelKey)}
              </h3>
              <p className="text-muted-foreground max-w-md">
                This wizard step will be implemented with your specific requirements. 
                Please share the details for the file upload wizard functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="border-border hover:bg-secondary"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            data-testid="wizard-prev-btn"
          >
            <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            className="bg-primary hover:bg-primary/90"
            disabled={currentStep === steps.length}
            onClick={() => setCurrentStep(prev => prev + 1)}
            data-testid="wizard-next-btn"
          >
            Next
            <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

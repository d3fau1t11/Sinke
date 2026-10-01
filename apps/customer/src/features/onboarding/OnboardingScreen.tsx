import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@senik/i18n';
import { Button, Card } from '@senik/ui';

const steps = [
  {
    id: 1,
    titleAm: 'ስለ ስንቅ',
    titleEn: 'About Senik',
    descAm: 'የሰፈርዎ ፈጣን ማድረሻ። ትኩስ ምግብ፣ የየዕለት ሸቀጥና መድሃኒት ወደ በርዎ ይመጣል።',
    descEn: 'Your neighborhood, delivered. Fresh food, daily groceries, and pharmacy to your door.',
    icon: 'local_shipping',
  },
  {
    id: 2,
    titleAm: 'ፈጣን ማድረሻ',
    titleEn: 'Fast Delivery',
    descAm: 'ባጃጅ፣ ሞተር ወይም ካሪ ቫን በ15-35 ደቂቃ ውስጥ።',
    descEn: 'Bajaj, motorbike, or van in 15-35 minutes.',
    icon: 'speed',
  },
  {
    id: 3,
    titleAm: 'የመጠበቂያ ክፍያ',
    titleEn: 'Flexible Payment',
    descAm: 'በጥሬ፣ ቴሌብር ወይም CBE ብር።',
    descEn: 'Cash, Telebirr, or CBE Birr.',
    icon: 'payments',
  },
];

export function OnboardingScreen() {
  const { isAm } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/location', { replace: true });
    }
  };

  const step = steps[currentStep]!;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl">
                {step.icon}
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl text-on-surface">
              {isAm ? step.titleAm : step.titleEn}
            </h2>
            <p className="mt-3 text-on-surface-variant leading-relaxed">
              {isAm ? step.descAm : step.descEn}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-1.5 rounded-full transition-all ${
                  index === currentStep ? 'bg-primary' : 'bg-outline-variant'
                }`}
              />
            ))}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
          >
            {currentStep === steps.length - 1
              ? (isAm ? 'ጀምር' : 'Get Started')
              : (isAm ? 'ቀጥል' : 'Next')}
            <span className="material-symbols-outlined ml-2">
              {currentStep === steps.length - 1 ? 'check' : 'arrow_forward'}
            </span>
          </Button>
        </Card>
      </div>

      <div className="px-4 pb-6 text-center">
        <p className="text-sm text-on-surface-variant">
          {isAm ? 'እባክዎ ሰፈርዎን ይምረጡ ለመጀመሪያ' : 'Select your area to start'}
        </p>
      </div>
    </div>
  );
}
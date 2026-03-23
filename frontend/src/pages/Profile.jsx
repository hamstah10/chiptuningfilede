import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Buildings,
  Key,
  Copy,
  Eye,
  EyeSlash
} from '@phosphor-icons/react';
import { useState } from 'react';

// Mock user data
const mockUser = {
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '+49 123 456 7890',
  company: 'Mustermann Tuning GmbH',
  street: 'Musterstraße 123',
  city: 'München',
  zip: '80331',
  country: 'Germany',
  vatId: 'DE123456789',
  apiKey: 'ctf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

export default function Profile() {
  const { t } = useLanguage();
  const [showApiKey, setShowApiKey] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout title={t('profileTitle')}>
      <div className="max-w-4xl">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-secondary border border-border p-1">
            <TabsTrigger 
              value="personal" 
              className="data-[state=active]:bg-primary data-[state=active]:text-foreground"
              data-testid="tab-personal"
            >
              <User weight="bold" className="w-4 h-4 mr-2" />
              {t('personalInfo')}
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className="data-[state=active]:bg-primary data-[state=active]:text-foreground"
              data-testid="tab-company"
            >
              <Buildings weight="bold" className="w-4 h-4 mr-2" />
              {t('companyInfo')}
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              className="data-[state=active]:bg-primary data-[state=active]:text-foreground"
              data-testid="tab-api"
            >
              <Key weight="bold" className="w-4 h-4 mr-2" />
              {t('apiAccess')}
            </TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card className="bg-card border-border" data-testid="personal-info-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <User weight="fill" className="w-5 h-5 text-primary" />
                  {t('personalInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      defaultValue={mockUser.firstName}
                      className="bg-secondary border-border"
                      data-testid="input-firstname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      defaultValue={mockUser.lastName}
                      className="bg-secondary border-border"
                      data-testid="input-lastname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      defaultValue={mockUser.email}
                      className="bg-secondary border-border"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      defaultValue={mockUser.phone}
                      className="bg-secondary border-border"
                      data-testid="input-phone"
                    />
                  </div>
                </div>
                <Button className="mt-6 bg-primary hover:bg-primary/90" data-testid="save-personal-btn">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Info */}
          <TabsContent value="company">
            <Card className="bg-card border-border" data-testid="company-info-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Buildings weight="fill" className="w-5 h-5 text-primary" />
                  {t('companyInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      defaultValue={mockUser.company}
                      className="bg-secondary border-border"
                      data-testid="input-company"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input 
                      id="street"
                      defaultValue={mockUser.street}
                      className="bg-secondary border-border"
                      data-testid="input-street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input 
                      id="zip"
                      defaultValue={mockUser.zip}
                      className="bg-secondary border-border"
                      data-testid="input-zip"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      defaultValue={mockUser.city}
                      className="bg-secondary border-border"
                      data-testid="input-city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      defaultValue={mockUser.country}
                      className="bg-secondary border-border"
                      data-testid="input-country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatId">VAT ID</Label>
                    <Input 
                      id="vatId"
                      defaultValue={mockUser.vatId}
                      className="bg-secondary border-border"
                      data-testid="input-vatid"
                    />
                  </div>
                </div>
                <Button className="mt-6 bg-primary hover:bg-primary/90" data-testid="save-company-btn">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Access */}
          <TabsContent value="api">
            <Card className="bg-card border-border" data-testid="api-access-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Key weight="fill" className="w-5 h-5 text-primary" />
                  {t('apiAccess')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label className="text-muted-foreground">API Key</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 p-3 bg-secondary rounded-sm border border-border font-mono text-sm">
                        {showApiKey ? mockUser.apiKey : '•'.repeat(40)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                        data-testid="toggle-api-key"
                      >
                        {showApiKey ? (
                          <EyeSlash weight="regular" className="w-5 h-5" />
                        ) : (
                          <Eye weight="regular" className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(mockUser.apiKey)}
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                        data-testid="copy-api-key"
                      >
                        <Copy weight="regular" className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-sm border border-border">
                    <h4 className="font-semibold text-foreground mb-2">API Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Use this API key to integrate with the Chiptuningfile.de API. 
                      Your API key is managed by your super admin portal.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-border hover:bg-secondary"
                      data-testid="view-docs-btn"
                    >
                      View Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

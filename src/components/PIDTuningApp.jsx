import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AboutSection = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>About</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p>Created by Mike Karl, Global Digital Water Lead AECOM.</p>
        <Alert variant="warning" className="mt-4">
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            This tool is provided "as is" without warranty of any kind, express or implied. 
            Use of this tool for PID tuning is at your own risk. Always verify tuning parameters 
            and test thoroughly in a controlled environment before implementing in production systems.
          </AlertDescription>
        </Alert>
      </div>
    </CardContent>
  </Card>
);

const IntroSection = () => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Wastewater Lambda Loop Tuning</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <p className="text-lg">
          This tool helps wastewater treatment plant operators tune PID loops using the step-response (lambda) tuning method. 
          It analyzes your process data to identify key parameters and suggests optimal PID settings.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Required CSV Format:</h3>
          <p className="mb-2">Your CSV file should contain three columns: time, MV, and CV with headers. Example:</p>
          <pre className="bg-gray-100 p-2 rounded">
            time,MV,CV{'\n'}
            0.0,50.0,2.0{'\n'}
            1.0,50.0,2.0{'\n'}
            2.0,60.0,2.0{'\n'}
            3.0,60.0,2.2{'\n'}
            ...
          </pre>
          <p className="mt-2 text-sm">
            Where:{'\n'}
            - time: Time in seconds{'\n'}
            - MV: Manipulated Variable (e.g., valve position, pump speed){'\n'}
            - CV: Controlled Variable (e.g., dissolved oxygen, nitrate levels)
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ControllerInfoForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    controlSystem: '',
    pidType: '',
    executionTime: '',
    outputType: '',
    specialFeatures: []
  });

  const controlSystems = [
    "Rockwell ControlLogix",
    "Emerson Ovation",
    "Schneider Modicon",
    "Standalone Controller",
    "Other"
  ];

  const pidTypes = [
    "Standard PID",
    "PIDE (Enhanced)",
    "Custom Implementation",
    "Other"
  ];

  const executionTimes = [
    "100ms",
    "500ms",
    "1s",
    "Variable"
  ];

  const outputTypes = [
    "Control Valve",
    "VFD",
    "Other Actuator"
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Controller Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Control System:</label>
            <Select 
              onValueChange={(value) => setFormData({...formData, controlSystem: value})}
              value={formData.controlSystem}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select control system" />
              </SelectTrigger>
              <SelectContent>
                {controlSystems.map(system => (
                  <SelectItem key={system} value={system}>
                    {system}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">PID Implementation:</label>
            <Select 
              onValueChange={(value) => setFormData({...formData, pidType: value})}
              value={formData.pidType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select PID type" />
              </SelectTrigger>
              <SelectContent>
                {pidTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Loop Execution Time:</label>
            <Select 
              onValueChange={(value) => setFormData({...formData, executionTime: value})}
              value={formData.executionTime}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select execution time" />
              </SelectTrigger>
              <SelectContent>
                {executionTimes.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Output Device Type:</label>
            <Select 
              onValueChange={(value) => setFormData({...formData, outputType: value})}
              value={formData.outputType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select output type" />
              </SelectTrigger>
              <SelectContent>
                {outputTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2">Special Features:</label>
            <div className="space-y-2">
              {['Anti-windup', 'Setpoint filtering', 'Feedforward', 'Cascade control'].map(feature => (
                <label key={feature} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.specialFeatures.includes(feature)}
                    onChange={(e) => {
                      const features = e.target.checked 
                        ? [...formData.specialFeatures, feature]
                        : formData.specialFeatures.filter(f => f !== feature);
                      setFormData({...formData, specialFeatures: features});
                    }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onComplete(formData)}
          >
            Continue to Data Upload
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

const PIDTuningApp = () => {
  const [showDataUpload, setShowDataUpload] = useState(false);
  const [controllerInfo, setControllerInfo] = useState(null);
  const [data, setData] = useState(null);
  const [processParams, setProcessParams] = useState(null);
  const [pidParams, setPidParams] = useState(null);
  const [lambda, setLambda] = useState(2.0);
  const [error, setError] = useState(null);

  const handleControllerInfoComplete = (info) => {
    setControllerInfo(info);
    setShowDataUpload(true);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <AboutSection />
      <IntroSection />
      
      {!showDataUpload ? (
        <ControllerInfoForm onComplete={handleControllerInfoComplete} />
      ) : (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Data Upload & Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Data upload and analysis UI */}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PIDTuningApp;
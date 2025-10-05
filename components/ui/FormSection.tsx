import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{title}</h2>
      <div>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
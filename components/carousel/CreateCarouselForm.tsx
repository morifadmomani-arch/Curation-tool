import React, { useState, useEffect } from 'react';
import { RouteNode, Carousel, CarouselVariant } from '../../types';
import FormSection from '../ui/FormSection';
import MultiSelect from '../ui/MultiSelect';
import Checkbox from '../ui/Checkbox';
import RegionSelector from '../ui/RegionSelector';
import { Icon, PlusIcon, TrashIcon } from '../ui/Icons';

// --- Reusable Field Components ---
interface InputFieldProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    type?: string;
    className?: string;
    error?: string;
    disabled?: boolean;
}
const InputField = ({ label, id, value, onChange, placeholder = '', required = false, type = 'text', className = '', error, disabled = false }: InputFieldProps) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            id={id} 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-indigo-500'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);


interface SelectFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, children, required = false, className = '', disabled = false }) => (
    <div className={className}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select id={id} value={value} onChange={onChange} disabled={disabled} className={`w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
            {children}
        </select>
    </div>
);

// --- Options for Selects ---
const carouselTypeOptions = [ "Hero Component", "Normal Carousel Component", "CW Component", "Square Component", "Banner Component" ];
const packageOptions = [ { value: 'all', label: 'All' }, { value: 'angami_only', label: 'ANGAMI_ONLY' }, { value: 'vip', label: 'VIP' }, { value: 'vip_sports', label: 'VIP_SPORTS' }, { value: 'ubox', label: 'UBOX' } ];
const ageOptions = [ { value: 'all', label: 'All' }, { value: '0-4', label: '0-4' }, { value: '5-8', label: '5-8' }, { value: '9-12', label: '9-12' }, { value: '+13', label: '+13' } ];
const deviceTypeOptions = [ { value: 'all', label: 'All' }, { value: 'web', label: 'Web' }, { value: 'mobile_android', label: 'Mobile Android' }, { value: 'mobile_ios', label: 'Mobile iOS' }, { value: 'android_tv', label: 'Android TV' } ];
const recommendationTypeOptions = [ "Editorials (Manual)", "Because you watched", "Mood", "Trending", "Popular" ];

// --- Helper Functions ---
const createDefaultVariant = (): CarouselVariant => ({
    id: `variant-${Date.now()}`,
    weight: 100,
    editorialName: 'GCC-Home-Hero',
    carouselCompType: 'Hero Component',
    packages: ['vip', 'vip_sports'],
    age: ['0-4', '5-8', '9-12', '+13'],
    deviceType: ['web', 'android_tv'],
    regionConfig: { selectedRegion: 'GCC', included: ['KSA', 'UAE', 'QATAR', 'BAHRAIN', 'OMAN', 'KUWAIT'], excluded: [] },
    recommendationType: 'Editorials (Manual)',
    vodAvailable: true,
    allowPrevious: true,
    removePrevious: false,
    episodeOrder: true,
    includeExclude: '',
    avodSvod: 'AVOD, SVOD',
});

// --- Main Component ---
interface CreateCarouselFormProps {
    route: RouteNode;
    onCancel: () => void;
    onCreate: (carouselData: Omit<Carousel, 'modified' | 'position'>) => void;
    onSave: (carouselData: Carousel) => void;
    carousel?: Carousel | null;
    isReadOnly?: boolean;
}

const CreateCarouselForm: React.FC<CreateCarouselFormProps> = ({ route, onCancel, onCreate, onSave, carousel, isReadOnly = false }) => {
    const isEditMode = !!carousel;

    // --- State ---
    const [carouselId, setCarouselId] = useState('');
    const [variants, setVariants] = useState<CarouselVariant[]>([]);
    const [activeVariantIndex, setActiveVariantIndex] = useState(0);
    const [errors, setErrors] = useState<Partial<Record<'carouselId' | 'variantName', string>>>({});
    const [enableAbTest, setEnableAbTest] = useState(false);
    const [abTestDuration, setAbTestDuration] = useState(5);
    
    const activeVariant = variants[activeVariantIndex];

    // --- Effects ---
    useEffect(() => {
        if (carousel) { // Edit or Preview mode
            setCarouselId(carousel.id);
            if (carousel.variants && carousel.variants.length > 0) {
                setVariants(carousel.variants);
            } else {
                // Fallback for older data without variants
                const fallbackVariant: CarouselVariant = {
                    ...createDefaultVariant(),
                    editorialName: carousel.editorialName,
                    carouselCompType: carousel.type,
                    deviceType: carousel.platforms,
                    recommendationType: carousel.recommendationType,
                    avodSvod: carousel.avodSvod,
                };
                setVariants([fallbackVariant]);
            }
            setEnableAbTest(carousel.abTestConfig?.enabled ?? false);
            setAbTestDuration(carousel.abTestConfig?.durationDays ?? 5);
        } else { // Create mode
            setCarouselId(`${Date.now()}`.slice(-6));
            setVariants([createDefaultVariant()]);
            setEnableAbTest(false);
            setAbTestDuration(5);
        }
        setActiveVariantIndex(0);
    }, [carousel]);

    // --- Handlers ---
    const handleVariantFieldChange = (field: keyof CarouselVariant, value: any) => {
        const newVariants = [...variants];
        newVariants[activeVariantIndex] = { ...newVariants[activeVariantIndex], [field]: value };
        setVariants(newVariants);
        if (field === 'editorialName' && errors.variantName) {
            setErrors(prev => ({ ...prev, variantName: undefined }));
        }
    };
    
    const addVariant = () => {
        if (variants.length < 4) {
            const newVariant = { ...createDefaultVariant(), id: `variant-${Date.now()}`, editorialName: `Variant ${variants.length + 1}`};
            setVariants([...variants, newVariant]);
            setActiveVariantIndex(variants.length);
        }
    };

    const removeVariant = (indexToRemove: number) => {
        if (variants.length > 1) {
            const newVariants = variants.filter((_, index) => index !== indexToRemove);
            setVariants(newVariants);
            setActiveVariantIndex(Math.max(0, activeVariantIndex - 1));
        }
    };

    const validate = () => {
        const newErrors: Partial<Record<'carouselId' | 'variantName', string>> = {};
        if (!carouselId.trim()) {
            newErrors.carouselId = 'ID is required.';
        } else if (!isEditMode && !/^\d+$/.test(carouselId)) {
            newErrors.carouselId = 'ID must contain only numbers.';
        }
        if (!variants[activeVariantIndex].editorialName.trim()) {
            newErrors.variantName = "Editorial's Name is required for this variant.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (status: 'Draft' | 'Active') => {
        if (isReadOnly || !validate()) { return; }

        const firstVariant = variants[0];
        const sharedData = {
            id: carouselId,
            status,
            items: Math.floor(Math.random() * 20) + 5,
            pinned: carousel?.pinned ?? false,
            editorialName: firstVariant.editorialName,
            type: firstVariant.carouselCompType,
            platforms: firstVariant.deviceType,
            recommendationType: firstVariant.recommendationType,
            avodSvod: firstVariant.avodSvod,
            abTestConfig: {
                enabled: enableAbTest,
                durationDays: abTestDuration,
            }
        };

        if (isEditMode) {
            const updatedCarousel: Carousel = { ...carousel, ...sharedData, variants: variants };
            onSave(updatedCarousel);
        } else {
            const newCarouselData: Omit<Carousel, 'modified' | 'position'> = { ...sharedData, variants: variants };
            onCreate(newCarouselData);
        }
    };
    
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCarouselId(e.target.value);
        if (errors.carouselId) { setErrors(prev => ({ ...prev, carouselId: undefined })); }
    };

    const getTitle = () => {
        if (isReadOnly) return "Preview Carousel";
        if (isEditMode) return "Edit Carousel";
        return "Create New Carousel";
    };

    if (!activeVariant) return null; // Render nothing until state is initialized

    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col animate-fade-in-down">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
                <div className="text-sm">
                    <span className="font-semibold text-gray-600">Path: </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">Movie/ {route.name}</span>
                </div>
            </div>

            {/* Variant Tabs */}
             <div className="flex items-center border-b mb-6">
                {variants.map((variant, index) => (
                    <div key={variant.id} className="relative">
                        <button
                            onClick={() => setActiveVariantIndex(index)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeVariantIndex === index ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Variant {index + 1}
                        </button>
                        {variants.length > 1 && !isReadOnly && (
                             <button onClick={() => removeVariant(index)} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 rounded-full">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        )}
                    </div>
                ))}
                {variants.length < 4 && !isReadOnly && (
                    <button onClick={addVariant} className="ml-2 flex items-center px-3 py-1 text-sm text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                        <Icon svg={PlusIcon} className="w-4 h-4 mr-1" />
                        Add Variant
                    </button>
                )}
            </div>
            
            {!isReadOnly && variants.length > 1 && (
                <FormSection title="A/B Test Configuration">
                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-md border">
                        <Checkbox
                            label="Automatically promote best variant after test duration"
                            checked={enableAbTest}
                            onChange={(checked) => setEnableAbTest(checked)}
                        />
                        {enableAbTest && (
                            <InputField
                                label="Test Duration (days)"
                                id="abTestDuration"
                                type="number"
                                value={abTestDuration}
                                onChange={(e) => setAbTestDuration(parseInt(e.target.value, 10) || 0)}
                                disabled={isReadOnly}
                                className="w-48"
                            />
                        )}
                    </div>
                </FormSection>
            )}

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <FormSection title="Carousel Configuration">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                        <InputField 
                            label="Editorial's Name" 
                            id="editorialName" 
                            value={activeVariant.editorialName} 
                            onChange={(e) => handleVariantFieldChange('editorialName', e.target.value)}
                            required
                            className="lg:col-span-2"
                            error={activeVariantIndex === variants.findIndex(v => !v.editorialName.trim()) ? errors.variantName : ''}
                            disabled={isReadOnly}
                        />
                        <InputField label="ID" id="carouselId" value={carouselId} onChange={handleIdChange} required error={errors.carouselId} disabled={isReadOnly || isEditMode} />
                        <InputField label="Weight" id="weight" type="number" value={activeVariant.weight} onChange={(e) => handleVariantFieldChange('weight', parseInt(e.target.value, 10) || 0)} required disabled={isReadOnly} />
                        <SelectField label="Type" id="carouselType" value={activeVariant.carouselCompType} onChange={(e) => handleVariantFieldChange('carouselCompType', e.target.value)} required disabled={isReadOnly}>
                           {carouselTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </SelectField>
                    </div>
                </FormSection>

                <FormSection title="Targeting & Packages">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MultiSelect label="Packages" options={packageOptions} selectedValues={activeVariant.packages} onChange={(v) => handleVariantFieldChange('packages', v)} />
                        <MultiSelect label="Age" options={ageOptions} selectedValues={activeVariant.age} onChange={(v) => handleVariantFieldChange('age', v)} />
                        <div className="md:col-span-2">
                            <MultiSelect label="Device Type" options={deviceTypeOptions} selectedValues={activeVariant.deviceType} onChange={(v) => handleVariantFieldChange('deviceType', v)} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <RegionSelector />
                    </div>
                </FormSection>

                 <FormSection title="Advanced Settings">
                     <SelectField label="Type" id="recType" value={activeVariant.recommendationType} onChange={e => handleVariantFieldChange('recommendationType', e.target.value)} disabled={isReadOnly}>
                        {recommendationTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </SelectField>
                 </FormSection>

                 {activeVariant.recommendationType === 'Mood' && (
                     <FormSection title="Recommendation Rules">
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                <Checkbox label="VOD available now" checked={activeVariant.vodAvailable} onChange={(v) => handleVariantFieldChange('vodAvailable', v)} />
                                <Checkbox label="Allow previous recommendations" checked={activeVariant.allowPrevious} onChange={(v) => handleVariantFieldChange('allowPrevious', v)} />
                                <Checkbox label="Remove Previous Content" checked={activeVariant.removePrevious} onChange={(v) => handleVariantFieldChange('removePrevious', v)} />
                                <Checkbox label="Episode/Clips order" checked={activeVariant.episodeOrder} onChange={(v) => handleVariantFieldChange('episodeOrder', v)} />
                            </div>
                            <InputField label="Include/Exclude Features" id="features" value={activeVariant.includeExclude} onChange={e => handleVariantFieldChange('includeExclude', e.target.value)} placeholder="Genre / Theme / Mood / Era / Cast etc" disabled={isReadOnly} />
                        </div>
                     </FormSection>
                 )}
            </div>

            <div className="flex justify-end items-center mt-6 pt-4 border-t space-x-3">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300">
                    {isReadOnly ? 'Close' : 'Cancel'}
                </button>
                {!isReadOnly && (
                    <>
                        <button onClick={() => handleSubmit('Draft')} className="px-6 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 border border-indigo-600">
                            Save
                        </button>
                        <button onClick={() => handleSubmit('Active')} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            {isEditMode ? 'Save & Activate' : 'Activate'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreateCarouselForm;
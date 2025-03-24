
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Types for our file data
export interface InputTextData {
  inputText: string[];
}

export interface CategoryData {
  category: string[];
  categoryDescription: string[];
}

export interface ExampleData {
  exampleInputText: string[];
  desiredCategory: string[];
}

export interface LabeledData {
  inputText: string[];
  category: string[];
}

// Database context type
interface DatabaseContextType {
  inputTextData: InputTextData | null;
  categoryData: CategoryData | null;
  exampleData: ExampleData | null;
  labeledData: LabeledData | null;
  uploadInputTextFile: (file: File) => Promise<void>;
  uploadCategoryFile: (file: File) => Promise<void>;
  uploadExampleFile: (file: File) => Promise<void>;
  storeLabeledData: (data: LabeledData) => void;
  clearAllData: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

// Create context
const DatabaseContext = createContext<DatabaseContextType>({
  inputTextData: null,
  categoryData: null,
  exampleData: null,
  labeledData: null,
  uploadInputTextFile: async () => {},
  uploadCategoryFile: async () => {},
  uploadExampleFile: async () => {},
  storeLabeledData: () => {},
  clearAllData: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
});

// Create a hook to use the database context
export const useDatabase = () => useContext(DatabaseContext);

// Helper function to read Excel files
const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData as any[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

// Provider component
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [inputTextData, setInputTextData] = useState<InputTextData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [exampleData, setExampleData] = useState<ExampleData | null>(null);
  const [labeledData, setLabeledData] = useState<LabeledData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle input text file upload
  const uploadInputTextFile = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    try {
      const jsonData = await readExcelFile(file);
      
      // Check file structure
      if (jsonData.length < 2) {
        throw new Error('Input text file must contain at least one row of data');
      }
      
      // Extract header and data
      const headers = jsonData[0] as string[];
      
      // Check if the file has the required header
      if (!headers.some(header => header.toLowerCase().includes('input') && header.toLowerCase().includes('text'))) {
        throw new Error('Input text file must have a column named "input text"');
      }
      
      // Find the index of the input text column
      const inputTextIndex = headers.findIndex(header => 
        header.toLowerCase().includes('input') && header.toLowerCase().includes('text')
      );
      
      // Extract input text data
      const inputText = jsonData.slice(1).map(row => String(row[inputTextIndex])).filter(Boolean);
      
      if (inputText.length === 0) {
        throw new Error('No input text found in the file');
      }
      
      // Store in local storage (simulating database)
      const userData = {
        inputText
      };
      
      localStorage.setItem(`enlable_inputTextData_${user.id}`, JSON.stringify(userData));
      setInputTextData(userData);
      
      toast.success('Input text file uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload input text file');
      console.error('Error uploading input text file:', error);
    }
  };

  // Handle category file upload
  const uploadCategoryFile = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    try {
      const jsonData = await readExcelFile(file);
      
      // Check file structure
      if (jsonData.length < 2) {
        throw new Error('Category file must contain at least one row of data');
      }
      
      // Extract header and data
      const headers = jsonData[0] as string[];
      
      // Check if the file has the required headers
      const categoryIndex = headers.findIndex(header => 
        header.toLowerCase().includes('category') && !header.toLowerCase().includes('description')
      );
      
      const descriptionIndex = headers.findIndex(header => 
        header.toLowerCase().includes('category') && header.toLowerCase().includes('description')
      );
      
      if (categoryIndex === -1 || descriptionIndex === -1) {
        throw new Error('Category file must have columns named "category" and "category description"');
      }
      
      // Extract category data
      const rows = jsonData.slice(1);
      const category = rows.map(row => String(row[categoryIndex])).filter(Boolean);
      const categoryDescription = rows.map(row => String(row[descriptionIndex])).filter(Boolean);
      
      if (category.length === 0 || categoryDescription.length === 0) {
        throw new Error('No category data found in the file');
      }
      
      // Store in local storage
      const userData = {
        category,
        categoryDescription
      };
      
      localStorage.setItem(`enlable_categoryData_${user.id}`, JSON.stringify(userData));
      setCategoryData(userData);
      
      toast.success('Category file uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload category file');
      console.error('Error uploading category file:', error);
    }
  };

  // Handle example file upload
  const uploadExampleFile = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    try {
      const jsonData = await readExcelFile(file);
      
      // Check file structure
      if (jsonData.length < 2) {
        throw new Error('Example file must contain at least one row of data');
      }
      
      // Extract header and data
      const headers = jsonData[0] as string[];
      
      // Check if the file has the required headers
      const exampleTextIndex = headers.findIndex(header => 
        header.toLowerCase().includes('example') && header.toLowerCase().includes('input') && header.toLowerCase().includes('text')
      );
      
      const desiredCategoryIndex = headers.findIndex(header => 
        header.toLowerCase().includes('desired') && header.toLowerCase().includes('category')
      );
      
      if (exampleTextIndex === -1 || desiredCategoryIndex === -1) {
        throw new Error('Example file must have columns named "example input text" and "desired category"');
      }
      
      // Extract example data
      const rows = jsonData.slice(1);
      const exampleInputText = rows.map(row => String(row[exampleTextIndex])).filter(Boolean);
      const desiredCategory = rows.map(row => String(row[desiredCategoryIndex])).filter(Boolean);
      
      if (exampleInputText.length === 0 || desiredCategory.length === 0) {
        throw new Error('No example data found in the file');
      }
      
      // Store in local storage
      const userData = {
        exampleInputText,
        desiredCategory
      };
      
      localStorage.setItem(`enlable_exampleData_${user.id}`, JSON.stringify(userData));
      setExampleData(userData);
      
      toast.success('Example file uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload example file');
      console.error('Error uploading example file:', error);
    }
  };

  // Store labeled data
  const storeLabeledData = (data: LabeledData) => {
    if (!user) {
      toast.error('You must be logged in to store data');
      return;
    }

    localStorage.setItem(`enlable_labeledData_${user.id}`, JSON.stringify(data));
    setLabeledData(data);
  };

  // Clear all data
  const clearAllData = () => {
    if (!user) return;
    
    localStorage.removeItem(`enlable_inputTextData_${user.id}`);
    localStorage.removeItem(`enlable_categoryData_${user.id}`);
    localStorage.removeItem(`enlable_exampleData_${user.id}`);
    localStorage.removeItem(`enlable_labeledData_${user.id}`);
    
    setInputTextData(null);
    setCategoryData(null);
    setExampleData(null);
    setLabeledData(null);
    
    toast.success('All data cleared');
  };

  // Load data from local storage when user changes
  React.useEffect(() => {
    if (user) {
      try {
        const storedInputTextData = localStorage.getItem(`enlable_inputTextData_${user.id}`);
        const storedCategoryData = localStorage.getItem(`enlable_categoryData_${user.id}`);
        const storedExampleData = localStorage.getItem(`enlable_exampleData_${user.id}`);
        const storedLabeledData = localStorage.getItem(`enlable_labeledData_${user.id}`);
        
        if (storedInputTextData) setInputTextData(JSON.parse(storedInputTextData));
        if (storedCategoryData) setCategoryData(JSON.parse(storedCategoryData));
        if (storedExampleData) setExampleData(JSON.parse(storedExampleData));
        if (storedLabeledData) setLabeledData(JSON.parse(storedLabeledData));
      } catch (error) {
        console.error('Error loading data from local storage:', error);
      }
    } else {
      // Clear state when user logs out
      setInputTextData(null);
      setCategoryData(null);
      setExampleData(null);
      setLabeledData(null);
    }
  }, [user]);

  // Context value
  const value = {
    inputTextData,
    categoryData,
    exampleData,
    labeledData,
    uploadInputTextFile,
    uploadCategoryFile,
    uploadExampleFile,
    storeLabeledData,
    clearAllData,
    isProcessing,
    setIsProcessing
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

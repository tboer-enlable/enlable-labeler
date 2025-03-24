
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

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
  storeLabeledData: (data: LabeledData, classificationId?: string) => Promise<string | undefined>;
  clearAllData: () => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  currentClassificationId: string | null;
  setCurrentClassificationId: (id: string | null) => void;
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
  storeLabeledData: async () => undefined,
  clearAllData: async () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  currentClassificationId: null,
  setCurrentClassificationId: () => {},
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
  const [currentClassificationId, setCurrentClassificationId] = useState<string | null>(null);

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
      
      // Store in Supabase
      let classificationId = currentClassificationId;
      
      // If no current classification ID, create a new one
      if (!classificationId) {
        const { data, error } = await supabase
          .from('user_classifications')
          .insert({
            user_id: user.id,
            input_texts: { data: inputText }
          })
          .select('id')
          .single();
        
        if (error) {
          throw error;
        }
        
        classificationId = data.id;
        setCurrentClassificationId(classificationId);
      } else {
        // Update existing classification
        const { error } = await supabase
          .from('user_classifications')
          .update({
            input_texts: { data: inputText },
            updated_at: new Date().toISOString()
          })
          .eq('id', classificationId);
        
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setInputTextData({ inputText });
      
      toast.success('Input text file uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload input text file');
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
      
      // Store in Supabase
      let classificationId = currentClassificationId;
      
      // If no current classification ID, create a new one
      if (!classificationId) {
        const { data, error } = await supabase
          .from('user_classifications')
          .insert({
            user_id: user.id,
            categories: { 
              categories: category, 
              descriptions: categoryDescription 
            }
          })
          .select('id')
          .single();
        
        if (error) {
          throw error;
        }
        
        classificationId = data.id;
        setCurrentClassificationId(classificationId);
      } else {
        // Update existing classification
        const { error } = await supabase
          .from('user_classifications')
          .update({
            categories: { 
              categories: category, 
              descriptions: categoryDescription 
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', classificationId);
        
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setCategoryData({ category, categoryDescription });
      
      toast.success('Category file uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload category file');
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
      
      // Store in Supabase
      let classificationId = currentClassificationId;
      
      // If no current classification ID, create a new one
      if (!classificationId) {
        const { data, error } = await supabase
          .from('user_classifications')
          .insert({
            user_id: user.id,
            examples: { 
              texts: exampleInputText, 
              categories: desiredCategory 
            }
          })
          .select('id')
          .single();
        
        if (error) {
          throw error;
        }
        
        classificationId = data.id;
        setCurrentClassificationId(classificationId);
      } else {
        // Update existing classification
        const { error } = await supabase
          .from('user_classifications')
          .update({
            examples: { 
              texts: exampleInputText, 
              categories: desiredCategory 
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', classificationId);
        
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setExampleData({ exampleInputText, desiredCategory });
      
      toast.success('Example file uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload example file');
      console.error('Error uploading example file:', error);
    }
  };

  // Store labeled data
  const storeLabeledData = async (data: LabeledData, classificationId?: string): Promise<string | undefined> => {
    if (!user) {
      toast.error('You must be logged in to store data');
      return;
    }

    try {
      let id = classificationId || currentClassificationId;
      
      if (!id) {
        // Create new classification record
        const { data: newData, error } = await supabase
          .from('user_classifications')
          .insert({
            user_id: user.id,
            results: { 
              texts: data.inputText, 
              categories: data.category 
            }
          })
          .select('id')
          .single();
        
        if (error) {
          throw error;
        }
        
        id = newData.id;
        setCurrentClassificationId(id);
      } else {
        // Update existing classification
        const { error } = await supabase
          .from('user_classifications')
          .update({
            results: { 
              texts: data.inputText, 
              categories: data.category 
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) {
          throw error;
        }
      }
      
      // Update local state
      setLabeledData(data);
      
      return id;
    } catch (error) {
      console.error('Error storing labeled data:', error);
      throw error;
    }
  };

  // Clear all data
  const clearAllData = async () => {
    if (!user) return;
    
    try {
      if (currentClassificationId) {
        // Delete the classification from Supabase
        const { error } = await supabase
          .from('user_classifications')
          .delete()
          .eq('id', currentClassificationId);
        
        if (error) {
          throw error;
        }
      }
      
      // Clear local state
      setInputTextData(null);
      setCategoryData(null);
      setExampleData(null);
      setLabeledData(null);
      setCurrentClassificationId(null);
      
      toast.success('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  // Load data from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadLatestClassification();
    } else {
      // Clear state when user logs out
      setInputTextData(null);
      setCategoryData(null);
      setExampleData(null);
      setLabeledData(null);
      setCurrentClassificationId(null);
    }
  }, [user]);

  // Load the latest classification data
  const loadLatestClassification = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_classifications')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found - this is fine
          return;
        }
        throw error;
      }
      
      if (data) {
        setCurrentClassificationId(data.id);
        
        // Process input texts
        if (data.input_texts) {
          const inputTexts = data.input_texts.data || [];
          if (inputTexts.length > 0) {
            setInputTextData({ inputText: inputTexts });
          }
        }
        
        // Process categories
        if (data.categories) {
          const categories = data.categories.categories || [];
          const descriptions = data.categories.descriptions || [];
          
          if (categories.length > 0 && descriptions.length > 0) {
            setCategoryData({ 
              category: categories, 
              categoryDescription: descriptions 
            });
          }
        }
        
        // Process examples
        if (data.examples) {
          const texts = data.examples.texts || [];
          const categories = data.examples.categories || [];
          
          if (texts.length > 0 && categories.length > 0) {
            setExampleData({ 
              exampleInputText: texts, 
              desiredCategory: categories 
            });
          }
        }
        
        // Process results
        if (data.results) {
          const texts = data.results.texts || [];
          const categories = data.results.categories || [];
          
          if (texts.length > 0 && categories.length > 0) {
            setLabeledData({ 
              inputText: texts, 
              category: categories 
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    }
  };

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
    setIsProcessing,
    currentClassificationId,
    setCurrentClassificationId
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export interface AdminData {
  id: string;
  name: string | null;
  email: string | null;
}

export interface RenderTabContentProps {
  id: string;
  activeTab: string;
  isSaving?: boolean;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
    }>
  >;
  formData: {
    name: string;
    email: string;
  };
  handleSaveProfile?: () => Promise<void>;
}

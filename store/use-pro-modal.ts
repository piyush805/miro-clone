import { create } from "zustand";

const defaultValues = { id: "", title: "" };

interface IProModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProModal = create<IProModal>((set) => ({
  isOpen: false,
  initialValues: defaultValues,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

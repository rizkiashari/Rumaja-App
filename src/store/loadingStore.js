import create from 'zustand';

const useLoading = create((set) => ({
  loading: false,
  setLoading: (loading) => set((state) => ({ ...state, loading })),
}));

export default useLoading;

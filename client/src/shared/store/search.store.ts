import { create } from 'zustand'

interface CandidateSearch {
  text: string
  status: string
}

interface SearchStore {
  candidateSearch: CandidateSearch
  setCandidateSearch: (search: CandidateSearch) => void
  searchTerms: string
  setSearchTerms: (text: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  candidateSearch: { text: '', status: '' },
  setCandidateSearch: (candidateSearch) => set({ candidateSearch }),
  searchTerms: '',
  setSearchTerms: (searchTerms) => set({ searchTerms }),
}))

export interface Candidate {
    id: string;           // e.g., "candidate_1"
    number: number;       // Display number (1-4)
    name: string;         // e.g., "Mas Ucup"
    photo: string;        // Path: "/candidates/candidate_1.jpeg"
    visi: string;         // Vision statement
    misi: string[];       // Array of mission points
}

import { ReactNode } from "react";

export type OpeningHours = {
    openingHours: [{
        id: string;
        day: ReactNode;
        isOpen: string;
        fromTime: ReactNode;
        toTime: ReactNode;
    }]
}
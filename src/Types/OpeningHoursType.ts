import { ReactNode } from "react";

export type OpeningHoursType = {

    id: string;
    day: ReactNode;
    isOpen: string;
    fromTime: ReactNode;
    toTime: ReactNode;

}
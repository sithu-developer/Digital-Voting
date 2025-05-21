import { SvgIconProps } from "@mui/material";

export interface SideBarListItemType {
    id : number,
    href : string,
    icon : React.ComponentType<SvgIconProps>
}

export interface ZodiacSignType {
    id : number;
    zodiac : string;
}
import { IconType } from "react-icons";

import {
  HiOutlineBolt,
  HiOutlineBoltSlash,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineComputerDesktop,
  HiOutlineFilm,
} from "react-icons/hi2";

export const iconLibrary: Record<string, IconType> = {
  bolt: HiOutlineBolt,
  boltSlash: HiOutlineBoltSlash,
  play: HiOutlinePlay,
  stop: HiOutlineStop,
  settings: HiOutlineCog6Tooth,
  back: HiOutlineChevronLeft,
  plus: HiOutlinePlus,
  trash: HiOutlineTrash,
  projector: HiOutlineComputerDesktop,
  film: HiOutlineFilm,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;

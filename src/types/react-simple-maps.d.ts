declare module "react-simple-maps" {
  import { ComponentType, SVGProps } from "react";

  interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (geos: any[]) => any[];
    children: (data: { geographies: any[] }) => React.ReactNode;
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: any;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    tabIndex?: number;
    role?: string;
    "aria-label"?: string;
    "aria-pressed"?: boolean;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseMove?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    onTouchStart?: (event: React.TouchEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveEnd?: (position: {
      coordinates: [number, number];
      zoom: number;
    }) => void;
    translateExtent?: [[number, number], [number, number]];
    filterZoomEvent?: (event: unknown) => boolean;
    children?: React.ReactNode;
  }

  interface LineProps extends SVGProps<SVGPathElement> {
    from?: [number, number];
    to?: [number, number];
    coordinates?: [number, number][];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: string;
    fill?: string;
    className?: string;
    style?: React.CSSProperties;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const Line: ComponentType<LineProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;

  interface MapProjection {
    (coordinates: [number, number]): [number, number] | null;
  }

  export function useMapContext(): {
    projection: MapProjection;
    path: (feature: unknown) => string;
    width: number;
    height: number;
  };
}

type NativeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
interface UseImageProps {
    /**
     * The image `src` attribute
     */
    src?: string;
    /**
     * The image `srcset` attribute
     */
    srcSet?: string;
    /**
     * The image `sizes` attribute
     */
    sizes?: string;
    /**
     * A callback for when the image `src` has been loaded
     */
    onLoad?: NativeImageProps["onLoad"];
    /**
     * A callback for when there was an error loading the image `src`
     */
    onError?: NativeImageProps["onError"];
    /**
     * If `true`, opt out of the `fallbackSrc` logic and use as `img`
     *
     * @default false
     */
    ignoreFallback?: boolean;
    /**
     * The key used to set the crossOrigin on the HTMLImageElement into which the image will be loaded.
     * This tells the browser to request cross-origin access when trying to download the image data.
     */
    crossOrigin?: NativeImageProps["crossOrigin"];
    loading?: NativeImageProps["loading"];
}
type Status = "loading" | "failed" | "pending" | "loaded";
type FallbackStrategy = "onError" | "beforeLoadOrError";
/**
 * React hook that loads an image in the browser,
 * and lets us know the `status` so we can show image
 * fallback if it is still `pending`
 *
 * @returns the status of the image loading progress
 *
 * @example
 *
 * ```jsx
 * function App(){
 *   const status = useImage({ src: "image.png" })
 *   return status === "loaded" ? <img src="image.png" /> : <Placeholder />
 * }
 * ```
 */
declare function useImage(props: UseImageProps): Status;
declare const shouldShowFallbackImage: (status: Status, fallbackStrategy: FallbackStrategy) => boolean;
type UseImageReturn = ReturnType<typeof useImage>;

export { FallbackStrategy, UseImageProps, UseImageReturn, shouldShowFallbackImage, useImage };

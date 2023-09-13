interface UseQueryProps {
    breakpoint?: string;
    below?: string;
    above?: string;
}
declare function useQuery(props: UseQueryProps): string;

export { UseQueryProps, useQuery };

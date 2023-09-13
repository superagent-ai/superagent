import * as react from 'react';
import { SystemStyleObject } from '@chakra-ui/system';

declare const BreadcrumbStylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const useBreadcrumbStyles: () => Record<string, SystemStyleObject>;

export { BreadcrumbStylesProvider, useBreadcrumbStyles };

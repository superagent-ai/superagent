import * as react from 'react';
import { SystemStyleObject } from '@chakra-ui/system';

declare const AvatarStylesProvider: react.Provider<Record<string, SystemStyleObject>>;
declare const useAvatarStyles: () => Record<string, SystemStyleObject>;

export { AvatarStylesProvider, useAvatarStyles };

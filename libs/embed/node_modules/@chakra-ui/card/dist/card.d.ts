import * as _chakra_ui_system from '@chakra-ui/system';
import { SystemProps, HTMLChakraProps, ThemingProps } from '@chakra-ui/system';

type CardOptions = {
    /**
     * The flex direction of the card
     */
    direction?: SystemProps["flexDirection"];
    /**
     * The flex alignment of the card
     */
    align?: SystemProps["alignItems"];
    /**
     * The flex distribution of the card
     */
    justify?: SystemProps["justifyContent"];
};
interface CardProps extends HTMLChakraProps<"div">, CardOptions, ThemingProps<"Card"> {
}
declare const Card: _chakra_ui_system.ComponentWithAs<"div", CardProps>;

export { Card, CardOptions, CardProps };

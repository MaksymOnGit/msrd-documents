import {Minimum, Property, Required} from "@tsed/schema";

export class DocumentItemCreate {

    @Required()
    productId: string;

    @Required()
    @Minimum(0.001)
    quantity: number;

    @Required()
    @Minimum(0)
    price: number;
}

export class DocumentItem extends DocumentItemCreate {

    @Property()
    productName: string;

    @Property()
    quantitativeUnit: string;
}
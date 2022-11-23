import {Model, ObjectID} from "@tsed/mongoose";
import {
    CollectionOf,
    Default,
    Enum,
    Format,
    Integer,
    Maximum,
    Minimum,
    MinItems,
    Property,
    Required
} from "@tsed/schema";
import {DocumentItem} from "./DocumentItem";

export enum DocumentStatus {
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    REJECTED = "REJECTED",
}



export class DocumentCreate {

    @Required()
    partnerName: string;

    @Default(true)
    validateStockAvailability: boolean = true;

    @Minimum(-1)
    @Maximum(1)
    @Default(1)
    @Integer()
    direction: number = 1;

    @Required()
    @MinItems(1)
    @CollectionOf(DocumentItem)
    items: DocumentItem[];
}

@Model()
export class Document extends DocumentCreate {

    @ObjectID("id")
    @Property()
    _id: string;

    @Property()
    price: number;

    @Property()
    owner: string;

    @Property()
    @Enum(DocumentStatus)
    status: DocumentStatus;

    @Format("date-time")
    @Default(Date.now)
    date: Date;
}
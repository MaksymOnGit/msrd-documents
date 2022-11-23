import {Default, Integer, Maximum, Minimum, Property} from "@tsed/schema";

export class DocumentQueryRequest {

    @Minimum(10)
    @Maximum(30)
    @Default(10)
    @Integer()
    rows: number

    @Minimum(0)
    @Integer()
    offset: number

    @Property()
    sortField?: string

    @Minimum(-1)
    @Maximum(1)
    @Property()
    sortOrder?: number
}

export class DocumentQueryResponse {
    result: Document[]
    page: number
    totalPagesCount: number
    totalRecordsCount: number
    recordsPerPageCount: number
    isNext: boolean
    isPrev: boolean
}
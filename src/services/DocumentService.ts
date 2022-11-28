import {Inject, Service} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {$log} from "@tsed/common";
import {DocumentCreate, Document, DocumentStatus} from "../models/document/Document";
import {DocumentQueryRequest, DocumentQueryResponse} from "../models/document/Query";


@Service()
export class DocumentService {
    @Inject(Document) private DocumentDAO: MongooseModel<Document>;

    /**
     * Find a calendar by his ID.
     * @param id
     * @returns {undefined|Document}
     */
    async find(id: string): Promise<Awaited<Document>> {
        $log.debug("Search a calendar from ID", id);
        const document = await this.DocumentDAO.findById(id).exec();

        $log.debug("Found", document);

        // @ts-ignore
        return Promise.resolve(document);
    }

    async create(userId: string, document: DocumentCreate): Promise<Awaited<Document>> {

        const tempDocument: Document = document as Document;
        tempDocument.owner = userId;
        tempDocument.date = new Date(Date.now());
        tempDocument.status = DocumentStatus.PROCESSING;
        tempDocument.price = tempDocument.items.reduce((accumulator, obj) => {
            return accumulator + (obj.quantity * obj.price);
        }, 0);

        const newDocument = await this.DocumentDAO.create(tempDocument as Document);

        return Promise.resolve(newDocument);
    }

    async query(all: boolean, userId: string, query: DocumentQueryRequest): Promise<Awaited<DocumentQueryResponse>> {
        const condition: Document = all ? {} as Document : {owner: userId} as Document;
        let docQuery = this.DocumentDAO.where(condition).skip(query.offset).limit(query.rows);

        if(query.sortField && query.sortOrder && query.sortOrder != 0 && ["partnerName", "validateStockAvailability", "direction", "items", "price", "status", "date"].includes(query.sortField)) {
            // @ts-ignore
            docQuery = docQuery.sort([[query.sortField, query.sortOrder]]);
        } else {
            docQuery = docQuery.sort([["date", -1]]);
        }

        const response = new DocumentQueryResponse();
        // @ts-ignore
        response.result = (await docQuery.exec());

        const totalRecCount = await this.DocumentDAO.count().exec();

        response.totalRecordsCount = totalRecCount
        response.totalPagesCount = totalRecCount / query.rows
        const currentRequestedPage = query.offset / query.rows

        if (currentRequestedPage < response.totalPagesCount) {
            response.page = currentRequestedPage + 1;
        } else {
            response.page = response.totalPagesCount + 1;
        }
        response.recordsPerPageCount = query.rows;
        response.isPrev = response.page > 1
        response.isNext = response.page < response.totalPagesCount

        return Promise.resolve(response);
    }
}
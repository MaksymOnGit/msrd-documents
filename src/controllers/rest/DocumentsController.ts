import {Controller} from "@tsed/di";
import {Description, Get, Post, Put, Required, Security, Status} from "@tsed/schema";
import {DocumentService} from "../../services/DocumentService";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {NotFound} from "@tsed/exceptions";
import {Document, DocumentCreate} from "../../models/document/Document";
import {Authenticate} from "@tsed/passport";
import {ObjectID} from "@tsed/mongoose";
import {Req} from "@tsed/common";
import {DocumentQueryRequest, DocumentQueryResponse} from "../../models/document/Query";

@Controller("/documents")
export class DocumentsController {
  constructor(private documentService: DocumentService) {
  }

  @Get("/:id")
  @Status(200, {description: "Success", type: Document})
  @Authenticate("jwt")
  @Security("jwt")
  async get(@Required() @PathParams("id") @ObjectID("id") id: string): Promise<Document> {
    const document = await this.documentService.find(id);

    if (!document) {
      throw new NotFound("Document not found");
    }

    return document;
  }

  @Put("/")
  @Status(201, {description: "Created", type: DocumentCreate})
  @Authenticate("jwt")
  @Security("jwt")
  async save(@Description("Document model")
       @BodyParams() @Required() document: DocumentCreate,
       @Req("user") user: string): Promise<Document>  {
      return await this.documentService.create(user, document);
  }

  @Post("/query")
  @Status(201, {description: "Result", type: DocumentQueryResponse})
  @Authenticate("jwt")
  @Security("jwt")
  async query(
      @Description("Bool all or own documents")
      @QueryParams("all")
      @Required() all: boolean,

      @Description("Query model")
      @BodyParams()
      @Required() query: DocumentQueryRequest,

      @Req("user") user: any): Promise<DocumentQueryResponse> {
      return await this.documentService.query(all, user, query);
  }
}

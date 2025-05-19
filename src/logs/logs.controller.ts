import { Body, Controller, Post, Get, Query } from "@nestjs/common";
import { LogsService } from "./logs.service";

@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService){}

    @Post()
    async create(@Body() log: any){
        return this.logsService.sendLog(log);
    }
    @Get()
    async getLogs(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('userId') userId?: string,
    ) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        return this.logsService.getLogs(pageNum, limitNum, userId);
    }
}
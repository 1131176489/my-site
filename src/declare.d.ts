// 在全局声明文件中（如 global.d.ts 或 declarations.d.ts）
import {AxiosResponse} from "axios";

declare global {
    interface Window {
        postForm: ({dest,filename,blob}:{dest:string,filename:string,blob:Blob|string}) => Promise<AxiosResponse<any>>;

    }
}

type MyResponse = {
    code:number,
    message:string,
    data:null|string
}
type DirectoryListItem = {
    filename:string,
    isFile:boolean,
    lastModified:number,
    path:string,
}
type Item = {
    id: number,
    name: string,
    completedDate: string[]
    checkInDate: string[]
    type: string,
    startDate: string,
    endDate: string,
    commentObj: { [key: string]: string },
    isArchive:boolean,
}
export {
    MyResponse,
    DirectoryListItem,
    Item,
}

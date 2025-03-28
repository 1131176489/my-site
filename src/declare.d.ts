type MyResponse = {
    code:number,
    message:string,
    data:null|string
}
type DirectoryListItem = {
    filename:string,
    isFile:boolean,
    lastModified:number,
    path?:string,
}
export {
    MyResponse,
    DirectoryListItem
}
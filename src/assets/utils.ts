import axios from "axios";
export const filePathToUrlPath = (path:string)=>{
    let temp = path.split("/")
    const diskIdentifier = temp.shift().toLowerCase().replaceAll(":","")
    temp = temp.map(value => encodeURIComponent(value))
    temp.unshift("/"+diskIdentifier)
    return temp.join("/")
}
const postForm = ({dest, filename, blob}:{dest:string,filename:string,blob:Blob}) => {
    if (!dest){
        dest = "D:/BackUpDictionary/浏览器下载"
    }
    const file = new File([blob],"1")
    return axios.postForm("/file/upload", {
        dest,
        filename,
        file,
    });
}
const getFileByAbsolutePath = async (path: string) => {

    return await axios.get(filePathToUrlPath(path))
}
const getDirectoryListByAbsolutePath = async (path: string) => {
    return await axios.post("/file/getDirectoryListByAbsolutePath", {
        path
    })
}
const downloadFile = (blob:Blob,filename:string)=>{
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download'; // 设置下载的文件名
    document.body.appendChild(link);
    link.click();

    // 3. 清理DOM和释放Blob内存
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
}
const mySleep =async (second:number)=>{
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, second * 1000)
    })
}
export {
    getFileByAbsolutePath,
    getDirectoryListByAbsolutePath,
    downloadFile,
    mySleep,
    postForm,
}
import axios from "axios";

const getFileByAbsolutePath = async (path: string) => {
    return await axios.get("/file/getFileByAbsolutePath", {
        params: {
            path
        },
        responseType:"blob"
    })
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
}
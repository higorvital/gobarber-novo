import IStorageProvider from "../models/IStorageProvider";

class FakeStorageProvider implements IStorageProvider {

    private storagedFiles: string[]= [];

    public async saveFile(file: string){
        this.storagedFiles.push(file);

        return file;
    }

    public async deleteFile(file: string){
        const fileIndex = this.storagedFiles.findIndex(f => f === file);

        this.storagedFiles.splice(fileIndex, 1);

    }
}

export default FakeStorageProvider;
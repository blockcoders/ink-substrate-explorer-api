import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FileUpload } from 'graphql-upload'
import { Repository } from 'typeorm'
import { Contract } from './entity/contract.entity'

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  async findOne(address: string): Promise<Contract> {
    const contract = await this.contractRepository.findOneBy({ address })
    if (!contract) {
      throw new NotFoundException(`Contract with address: ${address} not found`)
    }
    return contract
  }

  async uploadMetadata(contract: Contract, metadata: FileUpload): Promise<Boolean> {
    try {
      const { createReadStream, filename } = metadata
      console.log("FILE NAME: %j", filename)
      
      const stream = createReadStream();
      const chunks: any = [];

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        let buffer: Buffer;

        stream.on('data', function (chunk: any) {
          chunks.push(chunk);
        });

        stream.on('end', function () {
          buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        stream.on('error', reject);
      });

      const base64 = buffer.toString('base64');
      console.log("DATA: %j", base64)
      await this.contractRepository.save(contract)
    } catch (error) {
      console.error("Error: %j", error)
      return false
    }
    return true
  }
}

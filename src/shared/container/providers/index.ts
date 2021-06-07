import {container} from 'tsyringe';

import DiskStorageProvider  from '../providers/StorageProvider/implementations/DiskStorageProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'
import ICacheProvider from './CacheProvider/models/ICacheProvider';
import RedisCacheProvider from './CacheProvider/implementations/RedisCacheProvider';

container.registerSingleton(
    'StorageProvider',
    DiskStorageProvider
)

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarsMailTemplateProvider
)

container.registerInstance<IMailProvider>(
    'MailProvider',
    container.resolve(EtherealMailProvider)
)

container.registerInstance<ICacheProvider>(
    'CacheProvider',
    container.resolve(RedisCacheProvider)
)
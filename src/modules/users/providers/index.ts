import {container} from 'tsyringe';
import BCryptHashProvider from './implementations/BCryptHashProvider';

container.registerSingleton(
    'HashProvider',
    BCryptHashProvider
)
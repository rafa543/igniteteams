import AsyncStorage from '@react-native-async-storage/async-storage'
import { PLAYER_COLLECTION } from '@storage/storageConfig'
import { AppError } from '@utils/AppError'
import { playerGetByGroup } from './playersGetByGroup'

import { PlayerStorageDTO } from './PlayerStorageDto'


export async function playerAddByGroup(newPLayer: PlayerStorageDTO, group: string) {
    try {
        const storedPlayers = await playerGetByGroup(group)

        const playerAlreadyExists = storedPlayers.filter(player => player.name === newPLayer.name)

        if(playerAlreadyExists.length > 0){
            throw new AppError('Essa pessoa já está adicionada em um time aqui.')
        }

        const storage = JSON.stringify([...storedPlayers, newPLayer])

        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
    } catch (error) {
        throw (error)
    }
}
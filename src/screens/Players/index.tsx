import { FlatList, Alert, TextInput } from 'react-native'
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/HighLight';
import { Input } from '@components/Input';
import { Container, Form, HeaderList, NumberOfPlayer } from './styles';
import { useState, useEffect, useRef } from 'react';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playerGetByGroup } from '@storage/player/playersGetByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDto';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [team, setTeam] = useState("Time A")
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const route = useRoute()
  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)
  const navigation = useNavigation()

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', "Informe o nome da pessoa para adicionar")
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      newPlayerNameInputRef.current?.blur()

      setNewPlayerName("")
      fetchPlayersByTeam()
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova pessoa", error.message)
      } else {
        console.log(error)
        Alert.alert("Nova pessoa", "Não foi possivel adicionar.")
      }
    }

  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)
      const playerByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playerByTeam)
      
    } catch (error) {
      console.log(error)
      Alert.alert("Pessoas", "Não foi possivel carregar as pessoas do time selecionado")
    }finally{
      setIsLoading(false)
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()

    } catch (error) {
      console.log(error)
      Alert.alert("Remover pessoa", "Não foi possivel remover essa pessoa")
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)

      navigation.navigate("groups")
    } catch (error) {
      console.log(error)
      Alert.alert("Remover grupo", "Não foi possivel remover o grupo.")
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      "Remover",
      "Deseja remover a turma?",
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    )
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle='Adicione a galera e separe os times' />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder='Nome da pessoa'
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon icon='add' onPress={handleAddPlayer} />
      </Form>

      <HeaderList>

        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
          )}
          horizontal
        />
        <NumberOfPlayer>{players.length}</NumberOfPlayer>

      </HeaderList>


      {isLoading ? <Loading /> :
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard name={item.name} onRemove={() => handleRemovePlayer(item.name)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          ListEmptyComponent={() => (
            <ListEmpty message='Não há pessoas nesse time' />
          )}
        />
      }

      <Button title='Remover turma' type='SECONDARY' onPress={handleGroupRemove} />
    </Container>
  );
}


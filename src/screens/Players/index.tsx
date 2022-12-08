import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/HighLight';
import { Input } from '@components/Input';
import { Container, Form, HeaderList, NumberOfPlayer } from './styles';
import { FlatList } from 'react-native'
import { useState } from 'react';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

export function Players() {
  const [team, setTeam] = useState("Time A")
  const [players, setPlayers] = useState(["teste", "rafael","teste", "rafael", "rafael","teste", "rafael"])

  return (
    <Container>
      <Header />
      <Highlight title='Nome da turma' subtitle='Adicione a galera e separe os times' />

      <Form>
        <Input
          placeholder='Nome da pessoa'
          autoCorrect={false}
        />

        <ButtonIcon icon='add' />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "time b"]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
          )}
          horizontal
        />

        <NumberOfPlayer>{players.length}</NumberOfPlayer>

      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <PlayerCard name={item} onRemove={() => {}}/>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{paddingBottom: 100}, players.length === 0 && {flex: 1}]}
        ListEmptyComponent={() => (
          <ListEmpty message='Não há pessoas nesse time'/>
        )}
      />
      <Button title='Remover turma' type='SECONDARY'/>
    </Container>
  );
}


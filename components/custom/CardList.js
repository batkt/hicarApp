import {FlatList} from 'native-base';
import React from 'react';
import {RefreshControl} from 'react-native';

function CardList({
  next,
  jagsaalt,
  renderItem,
  keyExtractor,
  loading,
  onRefresh,
  ...props
}) {
  return (
    <React.Fragment>
      <FlatList
        {...props}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        onEndReached={next}
        data={jagsaalt}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </React.Fragment>
  );
}

export default CardList;

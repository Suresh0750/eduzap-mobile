import React, { ReactElement, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IRequest } from '../lib/types';
import { formatDate, isRecentRequest } from '../lib/utils';
import { Trash2 } from './Icons';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface RequestListProps {
  requests: IRequest[];
  isLoading: boolean;
  error: Error | string | null;
  onRefresh?: () => void;
  onDelete?: (id :string) => void;
  footerComponent?: ReactElement | null;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  isLoading,
  error,
  onRefresh,
  onDelete,
  footerComponent,
}) => {
  const [refreshing, setRefreshing] = useState(false);


  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderRequestItem = ({ item }: { item: IRequest }) => {
    console.log("item", item);
    const requestId = item._id || item.id;
    const isRecent = isRecentRequest(item.timestamp ?? '');

    return (
      <Card
        style={{
            ...styles.requestCard,
        }}
      >
        <View style={styles.requestContent}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.requestImage} />
          )}

          <View style={styles.requestDetails}>
            <View style={styles.requestHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.requestTitle}>{item.title}</Text>
                {isRecent && (
                  <View style={styles.recentBadge}>
                    <Text style={styles.recentBadgeText}>Recent</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                onPress={() => onDelete?.(requestId as string)}
                style={styles.deleteButton}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.requestInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{item.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{item.phone}</Text>
              </View>
            </View>

            <Text style={styles.timestamp}>{formatDate(item.timestamp!)}</Text>
          </View>
        </View>
      </Card>
    );
  };

  if (isLoading && requests.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card style={styles.errorCard}>
        <Text style={styles.errorTitle}>Error loading requests</Text>
        <Text style={styles.errorText}>
          {typeof error === 'string' ? error : error?.message || 'Unknown error'}
        </Text>
        <Button
          title="Retry"
          onPress={() => {
            onRefresh?.();
          }}
          style={styles.retryButton}
        />
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.id || item._id || Math.random().toString()}
        contentContainerStyle={[
          styles.listContent,
          requests.length === 0 && styles.emptyListContent,
        ]}
        ListFooterComponent={footerComponent ?? null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#22d3ee"
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No requests found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  requestCard: {
    marginBottom: 12,
  },
  recentCard: {
    borderColor: '#22d3ee',
    borderWidth: 1,
    backgroundColor: 'rgba(34, 211, 238, 0.05)',
  },
  requestContent: {
    flexDirection: 'row',
    gap: 12,
  },
  requestImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  requestDetails: {
    flex: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  recentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#22d3ee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  recentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0a0e1a',
  },
  deleteButton: {
    padding: 4,
  },
  requestInfo: {
    gap: 8,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    minWidth: 60,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f3f4f6',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    color: '#9ca3af',
    fontSize: 14,
  },
  errorCard: {
    margin: 16,
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyCard: {
    margin: 16,
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});


import { PaginationControls } from "@/components/PaginationControls";
import { RequestFilters } from "@/components/RequestFilters";
import { RequestForm } from "@/components/RequestForm";
import { RequestList } from "@/components/RequestList";
import { UserAlert } from "@/components/ui/UserAlert";
import { useDeleteRequest, useRequests } from "@/lib/hooks";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Toast from 'react-native-toast-message';


export default function Index() {
  const {
    requests,
    isLoading,
    error,
    mutate,
    filters,
  } = useRequests();

  const {
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    itemsPerPage,
    totalCount,
  } = filters;

  const { deleteRequest,isDeleting } = useDeleteRequest();
 

  const handleSearchChange = useCallback( (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, [setSearchQuery, setCurrentPage]);   



  const handleClearSearch = useCallback( () => {
    setSearchQuery('');
    setCurrentPage(1);
  }, [setSearchQuery, setCurrentPage]);

  const handleSuccess = useCallback(() => {
    mutate();
  }, [mutate]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / itemsPerPage);
  }, [totalCount, itemsPerPage]);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    if (!id) return;
    setPendingDeleteId(id);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteRequest(pendingDeleteId);
      setPendingDeleteId(null);
      setCurrentPage(1);
      mutate();
    } catch (error) {
      console.error(error);
      setDeleteError('Failed to delete request. Please try again.');
    }
  }, [deleteRequest, mutate, pendingDeleteId, setCurrentPage]);

  const handleDismissError = useCallback(() => {
    setDeleteError(null);
  }, []);

  const listHeader = useMemo(() => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EduZap</Text>
        <Text style={styles.headerSubtitle}>Request Management</Text>
      </View>

      <View style={styles.formSection}>
        <RequestForm onSuccess={handleSuccess} />
      </View>

      <View style={styles.listSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Requests</Text>
        </View>
        <RequestFilters
          onSearchChange={handleSearchChange}
          onSortChange={setSortOrder}
          onClearSearch={handleClearSearch}
          currentSearch={searchQuery}
          currentSort={sortOrder}
        />
      </View>
    </>
  ), [
    handleClearSearch,
    handleSearchChange,
    handleSuccess,
    searchQuery,
    sortOrder,
    setSortOrder,
  ]);

  const paginationFooter = useMemo(() => (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  ), [currentPage, totalPages, setCurrentPage]);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <RequestList
            requests={requests}
            isLoading={isLoading}
            isDeleting={isDeleting}
            error={error}
            onRefresh={mutate}
            onDelete={(id: string) => handleDelete(id)}
            headerComponent={listHeader}
            footerComponent={paginationFooter}
          />
          <Toast />
        </KeyboardAvoidingView>
        <View pointerEvents="box-none" style={styles.alertStack}>
          {pendingDeleteId ? (
            <UserAlert
              title="Delete Request"
              description="Are you sure you want to delete this request?"
              variant="warning"
              actions={[
                {
                  label: 'Cancel',
                  variant: 'secondary',
                  onPress: () => setPendingDeleteId(null),
                },
                {
                  label: isDeleting ? 'Deleting...' : 'Delete',
                  onPress: handleConfirmDelete,
                  buttonProps: { disabled: isDeleting },
                },
              ]}
            />
          ) : null}
          {deleteError ? (
            <UserAlert
              title="Error"
              description={deleteError}
              variant="danger"
              dismissible
              onDismiss={handleDismissError}
            />
          ) : null}
        </View>
        </SafeAreaView>
      </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  formSection: {
    padding: 16,
  },
  listSection: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  alertStack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



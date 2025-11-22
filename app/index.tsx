import { PaginationControls } from "@/components/PaginationControls";
import { RequestFilters } from "@/components/RequestFilters";
import { RequestForm } from "@/components/RequestForm";
import { RequestList } from "@/components/RequestList";
import { UserAlert } from "@/components/ui/UserAlert";
import { useDeleteRequest, useRequests } from "@/lib/hooks";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
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

  const pendingDeleteIdRef = useRef<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    if (!id) return;
    pendingDeleteIdRef.current = id;
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const id = pendingDeleteIdRef.current;
    if (!id) return;
    try {
      await deleteRequest(id);
      pendingDeleteIdRef.current = null;
      setShowDeleteModal(false);
      setCurrentPage(1);
      mutate();
    } catch (error) {
      console.error(error);
      setDeleteError('Failed to delete request. Please try again.');
    }
  }, [deleteRequest, mutate, setCurrentPage]);

  const handleDismissError = useCallback(() => {
    setDeleteError(null);
  }, []);

  const paginationFooter = useMemo(() => (
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      setIsModal={() => {
        pendingDeleteIdRef.current = null;
        setShowDeleteModal(false);
      }}
      isModal={pendingDeleteIdRef.current}
    />
  ), [currentPage, totalPages, setCurrentPage, showDeleteModal]);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>EduZap</Text>
            <Text style={styles.headerSubtitle}>Request Management</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
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
              <RequestList
                requests={requests}
                isLoading={isLoading}
                isDeleting={isDeleting}
                error={error}
                onRefresh={mutate}
                onDelete={(id: string) => handleDelete(id)}
                footerComponent={paginationFooter}
              />
            </View>
          </ScrollView>
          <Toast />
        </KeyboardAvoidingView>
        <View pointerEvents="box-none" style={styles.alertStack}>
          {showDeleteModal ? (
            <UserAlert
              title="Delete Request"
              description="Are you sure you want to delete this request?"
              variant="warning"
              actions={[
                {
                  label: 'Cancel',
                  variant: 'secondary',
                  onPress: () => {
                    pendingDeleteIdRef.current = null;
                    setShowDeleteModal(false);
                  },
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
    paddingBottom: 16,
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



import { PaginationControls } from "@/components/PaginationControls";
import { RequestFilters } from "@/components/RequestFilters";
import { RequestForm } from "@/components/RequestForm";
import { RequestList } from "@/components/RequestList";
import { useRequests } from "@/lib/hooks";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo } from "react";
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function Index() {
 const {
    requests,
    isLoading,
    error,
    mutate,
    filters: {
      currentPage,
      setCurrentPage,
      searchQuery,
      setSearchQuery,
      sortOrder,
      setSortOrder,
      itemsPerPage,
      totalCount,
    },
  } = useRequests();
 

   const handleSearchChange = useCallback( (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);   



  const handleClearSearch = useCallback( () => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleSuccess = () => {
    mutate();
  };

    const totalPages = useMemo(() => {
      return Math.ceil(totalCount / itemsPerPage);
    }, [totalCount, itemsPerPage]);



  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <StatusBar style="light" />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={() => Math.random().toString()}
        ListHeaderComponent={
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
                <RequestList
                requests={requests}
                isLoading={isLoading}
                error={error }
                onRefresh={() => {}}
                onDelete={() => {}}
              />
               {/* {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}   */}
              <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
          </View>
          </>
        }
      />
      </KeyboardAvoidingView>
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
});



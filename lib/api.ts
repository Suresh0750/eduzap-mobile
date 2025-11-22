import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { ApiResponse, IRequest } from "./types";

interface GetRequestsParams {
  search?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const useRequestsQuery = (params: GetRequestsParams) => {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IRequest[]>>("/requests", {
        params,
      });

      return response.data;
    },
    staleTime : Infinity // *used to store the data's 
  });
};


export const useCreateRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<ApiResponse<IRequest>>(
        "/requests",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },

    onSuccess: () => {
       // * used to clear the cache 
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};

export const useDeleteRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<ApiResponse<IRequest>>(
        `/requests/${id}`
      );

      return response.data;
    },

    onSuccess: () => {
      // * used to clear the cache 
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};


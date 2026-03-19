import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Employee } from "../types";

export const useGetEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await axios.get("/api/employees");
      return data;
    },
  });
};
import axiosClient from '~/lib/axios'

import type { AxiosRequestConfig } from 'axios'

/**
 * A generic resource class for handling CRUD operations for a specific API endpoint.
 * @template T The type of the resource object, which must have an 'id' property.
 * @template C The type of the data used for creating a resource. Defaults to T without 'id'.
 * @template U The type of the data used for updating a resource. Defaults to a partial of C.
 */
export class Resource<T extends { id: string | number }, C = Omit<T, 'id'>, U = Partial<C>> {
  protected uri: string

  constructor(uri: string) {
    this.uri = uri
  }

  /**
   * Fetches a list of resources.
   * @param {AxiosRequestConfig} config - Optional Axios request configuration (e.g., for query parameters).
   * @returns {Promise<T[]>} A promise that resolves to the list of resources.
   * Note: If your API returns a paginated response, you might want to adjust this or create a separate method.
   */
  list(config?: AxiosRequestConfig): Promise<T[]> {
    return axiosClient.get(`/${this.uri}`, config)
  }

  /**
   * Fetches a single resource by its ID.
   * @param {T['id']} id - The ID of the resource to fetch.
   * @param {AxiosRequestConfig} config - Optional Axios request configuration.
   * @returns {Promise<T>} A promise that resolves to the resource.
   */
  get(id: T['id'], config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.get(`/${this.uri}/${id}`, config)
  }

  /**
   * Creates a new resource.
   * @param {C} data - The data for the new resource.
   * @param {AxiosRequestConfig} config - Optional Axios request configuration.
   * @returns {Promise<T>} A promise that resolves to the newly created resource.
   */
  create(data: C, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.post(`/${this.uri}`, data, config)
  }

  /**
   * Updates an existing resource.
   * @param {T['id']} id - The ID of the resource to update.
   * @param {U} data - The data to update the resource with.
   * @param {AxiosRequestConfig} config - Optional Axios request configuration.
   * @returns {Promise<T>} A promise that resolves to the updated resource.
   */
  update(id: T['id'], data: U, config?: AxiosRequestConfig): Promise<T> {
    return axiosClient.put(`/${this.uri}/${id}`, data, config)
  }

  /**
   * Deletes a resource by its ID.
   * @param {T['id']} id - The ID of the resource to delete.
   * @param {AxiosRequestConfig} config - Optional Axios request configuration.
   * @returns {Promise<void>} A promise that resolves when the resource is deleted.
   */
  delete(id: T['id'], config?: AxiosRequestConfig): Promise<void> {
    return axiosClient.delete(`/${this.uri}/${id}`, config)
  }
}

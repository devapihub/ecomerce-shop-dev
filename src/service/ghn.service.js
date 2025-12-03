import { BadRequestError } from "../core/error.response.js";
import axios from "axios";

const GHN_BASE_URL = process.env.GHN_BASE_URL || '';
const GHN_TOKEN = process.env.GHN_TOKEN || ''; 

class GHNService {

    static async getProvinces() {
        try {
            const response = await axios.get(`${GHN_BASE_URL}/province`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                }
            });

            const data = response.data;
            
            if (data.code === 200 && data.data) {
                return data.data;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching provinces from GHN:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            throw new BadRequestError(`Không thể lấy danh sách tỉnh/thành phố: ${errorMessage}`);
        }
    }

    static async getDistricts(provinceId) {
        if (!provinceId) {
            throw new BadRequestError('Thiếu province_id');
        }

        try {
            const response = await axios.get(`${GHN_BASE_URL}/district`, {
                params: {
                    province_id: provinceId
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                }
            });

            const data = response.data;
            
            if (data.code === 200 && data.data) {
                return data.data;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching districts from GHN:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            throw new BadRequestError(`Không thể lấy danh sách quận/huyện: ${errorMessage}`);
        }
    }

    static async getWards(districtId) {
        if (!districtId) {
            throw new BadRequestError('Thiếu district_id');
        }

        try {
            const response = await axios.get(`${GHN_BASE_URL}/ward`, {
                params: {
                    district_id: districtId
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Token': GHN_TOKEN
                }
            });

            const data = response.data;
            
            if (data.code === 200 && data.data) {
                return data.data;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching wards from GHN:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            throw new BadRequestError(`Không thể lấy danh sách phường/xã: ${errorMessage}`);
        }
    }
}

export { GHNService };


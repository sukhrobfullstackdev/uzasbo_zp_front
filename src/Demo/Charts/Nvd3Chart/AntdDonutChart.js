import React, { useState, useEffect } from 'react';
import { Pie, G2 } from '@ant-design/plots';
import checked from '../../../assets/images/user/checked.png';
import notChecked from '../../../assets/images/user/notChecked.png';
import DashboardServices from '../../../services/Dashboard/dashboard.services';
import { Spin } from 'antd';

const AntdDonutChart = () => {

    const [statistics, setStatistics] = useState({ Verified: 1, Unverified: 1 });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const statistics = await DashboardServices.getVerifiedPersonList();
        setStatistics(statistics.data[0]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const G = G2.getEngine('canvas');
    const data = [
        {
            type: 'Checked',
            sold: statistics.Verified,
        },
        {
            type: 'Not Checked',
            sold: statistics.Unverified,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'sold',
        colorField: 'type',
        radius: 0.66,
        color: ['#56c427', '#ff9800'],
        label: {
            content: (obj) => {
                const group = new G.Group({});
                group.addShape({
                    type: 'image',
                    attrs: {
                        x: 0,
                        y: 0,
                        width: 50,
                        height: 50,
                        img: obj.type === 'Checked' ? checked : notChecked,
                    },
                });
                group.addShape({
                    type: 'text',
                    attrs: {
                        x: 20,
                        y: 54,
                        text: obj.type,
                        textAlign: 'center',
                        textBaseline: 'top',
                        fill: obj.type === 'Checked' ? '#56c427' : '#ff9800',
                    },
                });
                return group;
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    if (loading) {
        return (
            <div style={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        )
    }
    return <Pie {...config} />;
};

export default AntdDonutChart;

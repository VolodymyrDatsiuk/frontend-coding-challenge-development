import { useEffect, useMemo, useState } from 'react';
import { BarChart } from '../components/Chart';
import { useToast } from '../providers/toast';
import { BarChartData } from 'src/types';
import { Spinner } from '@/components/Spinner';

export function ChartBlock() {
  const [min, setMin] = useState<string>();
  const [max, setMax] = useState<string>();

  const [data, setData] = useState<BarChartData>();
  const [isLoading, setLoading] = useState(false);

  const { renderToast } = useToast();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/data/chart-data');
        const { data, status, message } = await response.json();

        if (status === 'error') {
          throw new Error(message);
        }

        setData(data);
        setLoading(false);

        renderToast('success', 'Data fetched successfully');
      } catch (error) {
        setLoading(false);

        renderToast('error', (error as Error).message);
      }
    };

    void fetchChartData();
  }, [renderToast]);

  const handleReset = () => {
    setMin('');
    setMax('');
  };

  const filteredData = useMemo<BarChartData | undefined>(() => {
    if (!data) {
      return;
    }

    const minLimit = min ? +min : -Infinity;
    const maxLimit = max ? +max : Infinity;

    const filterCb = (value: number) => value >= minLimit && value <= maxLimit;

    return {
      datasetOne: data.datasetOne.filter(filterCb),
      datasetTwo: data.datasetTwo.filter(filterCb),
    };
  }, [min, max, data]);

  return (
    <div>
      <div className='flex items-center mb-12'>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Min</span>
          <input
            type='number'
            value={min || ''}
            onChange={e => setMin(e.target.value)}
            max={max}
            className='w-24 h-8 text-sm'
          />
        </div>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Max</span>
          <input
            type='number'
            value={max || ''}
            onChange={e => setMax(e.target.value)}
            min={min}
            className='w-24 h-8 text-sm'
          />
        </div>
        <div className='flex flex-col pt-4 mx-4 w-100'>
          <button
            onClick={handleReset}
            className='bg-blue-600 flex justify-center items-center h-10 text-center text-white border focus:outline-none focus:ring-4 font-sm rounded-lg text-sm px-5 py-1.9'
          >
            Reset
          </button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <Spinner />
        ) : filteredData ? (
          <BarChart
            width={600}
            height={300}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  label: 'Dataset 1',
                  data: filteredData.datasetOne,
                  backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                  label: 'Dataset 2',
                  data: filteredData.datasetTwo,
                  backgroundColor: 'rgb(54, 162, 235)',
                },
              ],
            }}
          />
        ) : (
          <div className='text-lg text-center text-gray-500'>No data available</div>
        )}
      </div>
    </div>
  );
}

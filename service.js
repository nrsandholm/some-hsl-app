export const getStops = () => {
	return [
		{
		  id: 1,
		  name: 'Stop #1',
		  routes: [
			{
			  id: 1,
			  name: 'Route #1'
			},
			{
			  id: 2,
			  name: 'Route #2'
			},
			{
			  id: 3,
			  name: 'Route #3'
			}
		  ]
		},
		{
		  id: 2,
		  name: 'Stop #2',
		  routes: [
			{
			  id: 3,
			  name: 'Route #3'
			},
			{
			  id: 4,
			  name: 'Route #4'
			},
			{
			  id: 5,
			  name: 'Route #5'
			}
		  ]
		},
		{
		  id: 3,
		  name: 'Stop #3',
		  routes: [
			{
			  id: 5,
			  name: 'Route #5'
			},
			{
			  id: 6,
			  name: 'Route #6'
			},
			{
			  id: 7,
			  name: 'Route #7'
			}
		  ]
		}
	];
}

BSVE.init(function()
{
    var reqId = null,
        _title;

    BSVE.api.search.submit(function(query)
    {
        var filter = encodeURI('dateTime ge ' + query.startDate + ' and dateTime le ' + query.endDate );
        BSVE.api.datasource.query( 'PON', filter, null, null, function(response)
        {
            reqId = response;
            BSVE.api.datasource.result(response, onComplete, onError);
        }, onError );

        $('h3.msg').html( 'Loading...' ).show();
        $('#container').hide().html('');
        _title = 'PON: ' + query.startDate + ' - ' + query.endDate;
    }, true, false, true);

    function onComplete(response)
    {
        if ( response.status == 0 )
        {
            setTimeout(function(){ BSVE.api.datasource.result(reqId, onComplete, onError); }, 500);
        }
        else if (response.status == -1)
        {
            onError(response);
        }
        else
        {
            var _ponResults = response.result;
            if ( _ponResults.length )
            {
                plotChart(_ponResults);
                $('h3.msg').hide();
                $('#container').fadeIn();
            }
            else
            {
                $('h3.msg').html('No results found for this query. Please try another query').show();
            }
        }
    }

    function onError(response)
    {
        $('h3.msg').html('There was an error processing your request. Please try again later.').show();
    }

    BSVE.ui.dossierbar.create(function(status)
    {
        var svg = new XMLSerializer().serializeToString( $('svg')[0] ),
        canvas = document.createElement('canvas'),
        img = new Image();

        canvg(canvas, svg);
        img.src = canvas.toDataURL();
        var item = {
            dataSource: 'PON',
            title:_title,
            sourceDate : BSVE.api.dates.yymmdd(Date.now()),
            itemDetail: {
                statusIconType: 'Graph',
                Description: img.outerHTML
            }
        }
 
        BSVE.api.tagItem(item, status);
    });

    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color)
    {
        return {
            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    function plotChart(results)
    {
        var finalResults = [];
        for ( var i = 0; i < results.length; i++ )
        {
            for ( var j = 0; j < results[i].ponDataDetails.length; j++ )
            {
                var index = -1;
                for ( var _i = 0; _i < finalResults.length; _i++ )
                {
                    if ( finalResults[_i][0] == results[i].ponDataDetails[j].test ) { index = _i; }
                }
                if ( index >= 0 ){ finalResults[index][1]++ } else { finalResults.push([results[i].ponDataDetails[j].test, 1]); }
            }
        }

        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Percentage',
                data: finalResults
            }]
        });
    }
});